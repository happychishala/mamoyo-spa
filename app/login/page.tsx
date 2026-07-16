import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in | MaMoyo Back Office",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  if (await isAuthenticated()) redirect("/admin");
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
              Back Office
            </p>
            <p className="mt-4 text-sm text-mist-700">
              Sign in with your username to manage bookings, reports and stock.
            </p>
          </div>

          <LoginForm from={from} />
        </div>

        <p className="mt-6 text-center text-xs text-mist-600">
          MaMoyo Wellness &amp; Beauty — staff access only
        </p>
      </div>
    </div>
  );
}
