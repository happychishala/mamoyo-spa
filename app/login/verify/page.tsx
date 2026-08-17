import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession, getPending } from "@/lib/auth";
import VerifyForm from "./VerifyForm";

export const metadata: Metadata = {
  title: "Verify sign-in | MaMoyo Back Office",
  robots: { index: false, follow: false },
};

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  if (await getSession()) redirect("/admin");
  const pending = await getPending();
  if (!pending || pending.stage !== "verify") redirect("/login");
  const { from } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-mist-50 px-5 py-12">
      <div className="w-full max-w-sm animate-rise">
        <div className="rounded-2xl border border-mist-200 bg-white p-8 shadow-soft">
          <div className="flex flex-col items-center text-center">
            <Image
              src="/logo-mamoyo.png"
              alt="MaMoyo Wellness & Beauty — Kabulonga"
              width={2595}
              height={795}
              priority
              className="h-16 w-auto"
            />
            <p className="mt-3 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-mist-600">
              Two-step verification
            </p>
            <p className="mt-4 text-sm text-mist-700">
              Open your authenticator app and enter the current 6-digit code for MaMoyo.
            </p>
          </div>

          <VerifyForm from={from} />
        </div>

        <p className="mt-6 text-center text-xs text-mist-600">
          Lost your device? Ask an owner to reset your 2-step sign-in.
        </p>
      </div>
    </div>
  );
}
