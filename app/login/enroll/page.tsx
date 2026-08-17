import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession, getPending } from "@/lib/auth";
import { otpauthURL, qrSvg, formatSecret } from "@/lib/totp";
import EnrollForm from "./EnrollForm";

export const metadata: Metadata = {
  title: "Set up two-step sign-in | MaMoyo Back Office",
  robots: { index: false, follow: false },
};

export default async function EnrollPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  if (await getSession()) redirect("/admin");
  const pending = await getPending();
  if (!pending || pending.stage !== "enroll" || !pending.secret) redirect("/login");
  const { from } = await searchParams;

  const uri = otpauthURL(pending.secret, pending.username);
  const svg = await qrSvg(uri);
  const secret = formatSecret(pending.secret);

  return (
    <div className="flex min-h-screen items-center justify-center bg-mist-50 px-5 py-12">
      <div className="w-full max-w-md animate-rise">
        <div className="rounded-2xl border border-mist-200 bg-white p-8 shadow-soft">
          <div className="flex flex-col items-center text-center">
            <Image
              src="/logo-mamoyo.png"
              alt="MaMoyo Wellness & Beauty — Kabulonga"
              width={2595}
              height={795}
              priority
              className="h-14 w-auto"
            />
            <p className="mt-3 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-mist-600">
              Set up two-step sign-in
            </p>
            <p className="mt-4 text-sm text-mist-700">
              This is a one-time setup. Protect your account with a free authenticator
              app — no SMS needed and it works offline.
            </p>
          </div>

          <ol className="mt-6 space-y-4 text-sm text-mist-700">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mist-600 text-xs font-semibold text-white">1</span>
              <span>
                Install a free authenticator app — <span className="font-medium text-mist-900">Google Authenticator</span>,{" "}
                <span className="font-medium text-mist-900">Microsoft Authenticator</span> or{" "}
                <span className="font-medium text-mist-900">Authy</span>.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mist-600 text-xs font-semibold text-white">2</span>
              <span>In the app, tap “add” and scan this QR code:</span>
            </li>
          </ol>

          <div className="mt-4 flex flex-col items-center">
            <div
              className="h-44 w-44 rounded-xl border border-mist-200 bg-white p-2 [&>svg]:h-full [&>svg]:w-full"
              // The SVG is generated server-side by the qrcode library from our
              // own otpauth URI — no user input is interpolated into it.
              dangerouslySetInnerHTML={{ __html: svg }}
            />
            <p className="mt-3 text-center text-xs text-mist-600">
              Can’t scan? Enter this key manually:
            </p>
            <p className="mt-1 select-all rounded-lg bg-mist-50 px-3 py-1.5 text-center font-mono text-sm tracking-wide text-mist-900">
              {secret}
            </p>
          </div>

          <div className="mt-6 flex gap-3 text-sm text-mist-700">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mist-600 text-xs font-semibold text-white">3</span>
            <span>Add your mobile number and the 6-digit code your app now shows:</span>
          </div>

          <EnrollForm from={from} />
        </div>

        <p className="mt-6 text-center text-xs text-mist-600">
          Keep the authenticator app — you’ll need it every time you sign in.
        </p>
      </div>
    </div>
  );
}
