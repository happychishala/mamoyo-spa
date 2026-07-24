import type { Metadata } from "next";
import { MessageCircle, Mail } from "lucide-react";
import { readDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { locationInfo } from "@/lib/content";
import { PageHeader, Card, NoAccess } from "@/components/admin/ui";
import { EmailSettingsForm, TestEmailForm } from "./SettingsForm";
import NotificationsTable from "./NotificationsTable";

export const metadata: Metadata = { title: "Notifications" };
export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const session = await getSession();
  if (session?.role === "Staff") return <NoAccess area="Notifications" />;

  const db = await readDb();
  const s = db.emailSettings;
  const log = [...(db.notifications ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const sent = log.filter((n) => n.status === "sent").length;
  const failed = log.filter((n) => n.status === "failed").length;

  const therapistsWithoutEmail = db.therapists.filter((t) => t.active && !t.email);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Notifications"
        description="Booking alerts to the team, and invoices and receipts sent to guests by email or WhatsApp."
      />

      {/* Email */}
      <Card className="p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-mist-100 text-mist-600">
            <Mail className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="font-serif text-xl font-semibold text-mist-950">Email</h2>
            <p className="mt-1 text-sm text-mist-700">
              A new booking emails the assigned therapist and the branch inbox. Invoices and receipts
              are sent from their own pages.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <EmailSettingsForm
            settings={{
              enabled: s.enabled,
              fromAddress: s.fromAddress,
              alertKabulonga: s.alertKabulonga,
              alertTwangale: s.alertTwangale,
              hasKey: Boolean(s.apiKey),
            }}
          />
        </div>

        <div className="mt-6 border-t border-mist-100 pt-6">
          <TestEmailForm />
        </div>

        {s.lastMessage && (
          <p className="mt-5 rounded-xl bg-mist-50 px-4 py-3 text-xs text-mist-700">
            <span className="font-semibold text-mist-900">Last attempt:</span> {s.lastMessage}
            {s.lastSentAt && ` · ${new Date(s.lastSentAt).toLocaleString("en-GB")}`}
          </p>
        )}
      </Card>

      {/* WhatsApp */}
      <Card className="p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-mist-100 text-mist-600">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="font-serif text-xl font-semibold text-mist-950">WhatsApp</h2>
            <p className="mt-1 text-sm leading-relaxed text-mist-700">
              Invoices and receipts have a <strong>WhatsApp</strong> button that opens a chat with the
              guest, message already written, for you to press send. It uses whichever MaMoyo number
              the device is signed in to, so both numbers keep working normally in the WhatsApp app.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {(["Kabulonga", "Twangale"] as const).map((key) => (
            <div key={key} className="rounded-xl border border-mist-200 p-4">
              <p className="text-sm font-semibold text-mist-950">{locationInfo[key].name}</p>
              <p className="mt-1 text-sm text-mist-700">{locationInfo[key].phone}</p>
            </div>
          ))}
        </div>

        <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-xs leading-relaxed text-amber-900">
          Sending automatically, without a person pressing send, needs the WhatsApp Cloud API — a
          Meta Business account, approved message templates, and a decision about whether these
          numbers move onto the platform. Ask if you would like that scoped.
        </p>
      </Card>

      {/* Nudge: therapists who cannot be alerted */}
      {therapistsWithoutEmail.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/60 p-5">
          <h2 className="font-serif text-base font-semibold text-amber-900">
            {therapistsWithoutEmail.length} therapist
            {therapistsWithoutEmail.length === 1 ? " has" : "s have"} no email address
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-amber-900/90">
            Bookings assigned to {therapistsWithoutEmail.map((t) => t.name).join(", ")} will only
            reach the branch inbox. Add addresses on the Team page.
          </p>
        </Card>
      )}

      {/* History */}
      <Card className="p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-serif text-xl font-semibold text-mist-950">History</h2>
          <p className="text-sm text-mist-700">
            {sent} sent
            {failed > 0 && <span className="font-semibold text-red-700"> · {failed} failed</span>}
          </p>
        </div>
        <div className="mt-5">
          <NotificationsTable rows={log} />
        </div>
      </Card>
    </div>
  );
}
