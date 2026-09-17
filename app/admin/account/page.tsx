import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { PageHeader, Card } from "@/components/admin/ui";
import ChangePasswordForm from "./ChangePasswordForm";

export const metadata: Metadata = { title: "Account" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) return null;
  const isRootAdmin = session.username === "admin";

  return (
    <div className="space-y-8">
      <PageHeader title="Your account" description="Manage your sign-in details." />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Card className="h-fit p-6">
          <h2 className="font-serif text-lg font-semibold text-mist-950">Signed in as</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-mist-600">Username</dt>
              <dd className="font-medium text-mist-950">{session.username}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-mist-600">Role</dt>
              <dd className="font-medium text-mist-950">{session.role}</dd>
            </div>
          </dl>
          <p className="mt-5 rounded-xl bg-mist-50 px-3.5 py-3 text-xs leading-relaxed text-mist-600">
            Your two-factor authenticator can be reset by an Owner from the Team page if you lose your phone.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="font-serif text-lg font-semibold text-mist-950">Change password</h2>
          {isRootAdmin ? (
            <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm leading-relaxed text-amber-800">
              You are signed in as the root <span className="font-semibold">admin</span> account, whose password is set
              in the server environment (<code className="rounded bg-amber-100 px-1">ADMIN_PASSWORD</code>) and can&apos;t
              be changed here. Create named user accounts on the Team page — those users can change their own passwords.
            </p>
          ) : (
            <div className="mt-4">
              <ChangePasswordForm />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
