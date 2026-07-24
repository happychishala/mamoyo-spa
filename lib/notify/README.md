# Notifications

Two channels, deliberately built differently.

## Email — automatic

Sends through [Resend](https://resend.com) over plain HTTP (no SDK). Settings live
in the database (`emailSettings`) rather than env vars, so a manager can rotate
the key from **Back office → Notifications** without a redeploy.

To switch it on:

1. Create a Resend account and add `mamoyospa.com` as a domain.
2. Add the DNS records Resend gives you (SPF + DKIM) at your domain registrar.
   Until this is done, mail from `@mamoyospa.com` will be rejected or land in spam.
3. Paste the API key and a verified sender (e.g. `MaMoyo <noreply@mamoyospa.com>`)
   into Notifications, set the two branch inboxes, and tick Enabled.
4. Use **Send test email** to confirm before relying on it.

Nothing throws if email is off or misconfigured — a booking is still taken, and
the reason is recorded in the notification log.

Swapping provider means replacing `sendViaResend` in `index.ts`; everything else
is provider-agnostic.

## WhatsApp — click to send

`whatsappLink()` builds a `wa.me` link with the message pre-written. Staff click
it in the back office, WhatsApp opens, they press send.

This is deliberate. Sending programmatically requires the **WhatsApp Cloud API**,
which brings prerequisites MaMoyo has to decide on:

- A Meta Business account with a verified business, and a WhatsApp Business
  Account with a registered number.
- **The number question.** A number registered to the Cloud API cannot normally
  also be used in the WhatsApp Business app. Meta's Coexistence feature allows
  both, but availability varies by region and account type and would need
  checking for Zambia. Migrating +260 967 245833 or +260 765 022713 without
  Coexistence would take that number out of the app the team uses daily.
- **The 24-hour window.** Free-form messages (including documents) can only be
  sent within 24 hours of the guest's last message. Outside it, only templates
  Meta has pre-approved may be sent, and approval takes 24–48 hours.
- Sending a PDF requires hosting it at a URL Meta's servers can fetch, which
  means a public link to a document containing guest details.

If MaMoyo goes ahead, the drop-in point is a `sendViaCloudApi` function beside
`sendViaResend`, plus templates registered for the invoice and receipt cases.
The message bodies in `messages.ts` are already channel-neutral (`text` for
WhatsApp, `html` for email), so the copy would not need rewriting.
