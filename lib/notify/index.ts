import {
  readDb,
  writeDb,
  type DB,
  type Booking,
  type Invoice,
  type Receipt,
  type Location,
  type NotificationKind,
  type NotificationChannel,
  type NotificationStatus,
} from "../db";
import { locationInfo } from "../content";
import { bookingAlert, invoiceMessage, receiptMessage, type Message } from "./messages";

export type { Message };
export { bookingAlert, invoiceMessage, receiptMessage };

export interface SendOutcome {
  status: NotificationStatus;
  detail: string;
}

/** Strip a phone number down to the digits wa.me expects. */
export function waDigits(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}

/**
 * A click-to-send WhatsApp link.
 *
 * MaMoyo's numbers are live in the WhatsApp Business app, so nothing here sends
 * on their behalf — the link opens WhatsApp with the message already written and
 * a member of staff presses send. That keeps the existing numbers usable and
 * needs no Meta approval. See lib/notify/README.md for what full automation
 * through the Cloud API would require.
 */
export function whatsappLink(toPhone: string, body: string): string {
  return `https://wa.me/${waDigits(toPhone)}?text=${encodeURIComponent(body)}`;
}

/** The MaMoyo number a guest should be replying to, by branch. */
export function branchPhone(location?: Location): string {
  return locationInfo[location ?? "Kabulonga"].phone;
}

async function sendViaResend(
  settings: DB["emailSettings"],
  to: string,
  message: Message
): Promise<SendOutcome> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${settings.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: settings.fromAddress,
        to: [to],
        subject: message.subject,
        html: message.html,
        text: message.text,
      }),
    });

    if (res.ok) return { status: "sent", detail: "Delivered to the email provider." };

    const body = await res.text();
    // Surface the provider's own wording — it names the actual problem
    // (unverified domain, bad key) far better than a generic message would.
    return { status: "failed", detail: `Provider returned ${res.status}: ${body.slice(0, 300)}` };
  } catch (err) {
    return { status: "failed", detail: `Could not reach the email provider: ${String(err).slice(0, 200)}` };
  }
}

/** Write an entry to the notification log. Mutates the passed db; caller saves. */
export function logNotification(
  db: DB,
  entry: {
    kind: NotificationKind;
    channel: NotificationChannel;
    recipient: string;
    subject: string;
    reference: string;
    outcome: SendOutcome;
  }
): void {
  db.notifications ??= [];
  db.notifications.unshift({
    id: crypto.randomUUID(),
    kind: entry.kind,
    channel: entry.channel,
    recipient: entry.recipient,
    subject: entry.subject,
    reference: entry.reference,
    status: entry.outcome.status,
    detail: entry.outcome.detail,
    createdAt: new Date().toISOString(),
  });
  // Keep the log to a sensible size — the whole DB is one value in Redis.
  if (db.notifications.length > 500) db.notifications.length = 500;
}

/**
 * Send one email and record the attempt.
 *
 * Never throws: a booking must still be taken if the mail provider is down, so
 * failures are logged and returned rather than raised.
 */
export async function sendEmail(
  db: DB,
  to: string,
  message: Message,
  meta: { kind: NotificationKind; reference: string }
): Promise<SendOutcome> {
  const settings = db.emailSettings;
  let outcome: SendOutcome;

  if (!to?.trim()) {
    outcome = { status: "not-configured", detail: "No recipient address on record." };
  } else if (!settings?.enabled) {
    outcome = { status: "not-configured", detail: "Email sending is switched off in Notifications." };
  } else if (!settings.apiKey || !settings.fromAddress) {
    outcome = { status: "not-configured", detail: "Email provider key or sender address is missing." };
  } else {
    outcome = await sendViaResend(settings, to.trim(), message);
    settings.lastStatus = outcome.status === "sent" ? "sent" : "failed";
    settings.lastMessage = outcome.detail;
    settings.lastSentAt = new Date().toISOString();
  }

  logNotification(db, {
    kind: meta.kind,
    channel: "email",
    recipient: to || "—",
    subject: message.subject,
    reference: meta.reference,
    outcome,
  });
  return outcome;
}

/**
 * Alert the people who need to know about a booking: the assigned therapist if
 * they have an address on file, plus the branch inbox. Reads and saves the db
 * itself so callers can fire it without threading state through.
 */
export async function alertBooking(booking: Booking): Promise<SendOutcome[]> {
  const db = await readDb();
  const settings = db.emailSettings;
  const branchInbox =
    (booking.location ?? "Kabulonga") === "Twangale"
      ? settings?.alertTwangale
      : settings?.alertKabulonga;

  const targets: { to: string; name?: string }[] = [];

  if (booking.therapist) {
    const therapist = db.therapists.find((t) => t.name === booking.therapist && t.active);
    if (therapist?.email) targets.push({ to: therapist.email, name: therapist.name.split(" ")[0] });
  }
  if (branchInbox?.trim()) targets.push({ to: branchInbox.trim() });

  if (targets.length === 0) {
    // Still record it, so the log explains the silence.
    logNotification(db, {
      kind: "booking-alert",
      channel: "email",
      recipient: "—",
      subject: `New booking ${booking.ref}`,
      reference: booking.ref,
      outcome: {
        status: "not-configured",
        detail: "No therapist email and no branch inbox set for this location.",
      },
    });
    await writeDb(db);
    return [];
  }

  const outcomes: SendOutcome[] = [];
  for (const t of targets) {
    outcomes.push(
      await sendEmail(db, t.to, bookingAlert(booking, t.name), {
        kind: "booking-alert",
        reference: booking.ref,
      })
    );
  }
  await writeDb(db);
  return outcomes;
}
