import type { Metadata } from "next";
import { UserCheck, UserX, ShieldAlert } from "lucide-react";
import { readDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { setTherapistStatus, setUserActive } from "@/lib/actions";
import { formatMoney } from "@/lib/format";
import { PageHeader, Card } from "@/components/admin/ui";
import { AddTherapistForm, AddUserForm } from "./TeamForms";
import { RoleManager } from "./RoleForms";

export const metadata: Metadata = { title: "Team" };
export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const session = await getSession();
  if (!session || session.role === "Staff") {
    return (
      <Card className="mx-auto mt-20 max-w-md p-10 text-center">
        <ShieldAlert className="mx-auto h-8 w-8 text-mist-400" aria-hidden="true" />
        <h1 className="mt-4 font-serif text-xl font-semibold text-mist-950">Managers only</h1>
        <p className="mt-2 text-sm text-mist-700">
          Ask the owner or a manager if something on the team needs changing.
        </p>
      </Card>
    );
  }

  const db = await readDb();
  const therapists = [...db.therapists].sort((a, b) =>
    a.active === b.active ? a.name.localeCompare(b.name) : a.active ? -1 : 1
  );
  const isOwner = session.role === "Owner";

  return (
    <div className="space-y-8">
      <PageHeader
        title="Team"
        description="Therapists appear in booking assignments only while active — mark leavers as ex-employees and their history stays in the reports."
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="p-6 xl:col-span-2">
          <h2 className="font-serif text-lg font-semibold text-mist-950">Therapists</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-mist-200 text-xs font-semibold uppercase tracking-wide text-mist-600">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Monthly target</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist-100">
                {therapists.map((t) => (
                  <tr key={t.id} className={t.active ? undefined : "opacity-70"}>
                    <td className="py-3.5 pr-4 font-medium text-mist-950">{t.name}</td>
                    <td className="py-3.5 pr-4 text-mist-800">{formatMoney(t.monthlyTarget)}</td>
                    <td className="py-3.5 pr-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                          t.active
                            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                            : "border-slate-200 bg-slate-100 text-slate-600"
                        }`}
                      >
                        {t.active ? "Active" : "Ex-employee"}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <form action={setTherapistStatus} className="flex justify-end">
                        <input type="hidden" name="id" value={t.id} />
                        <input type="hidden" name="active" value={String(!t.active)} />
                        {t.active ? (
                          <button
                            type="submit"
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-mist-300 px-3.5 py-2 text-xs font-semibold text-mist-700 transition-colors duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                          >
                            <UserX className="h-3.5 w-3.5" aria-hidden="true" />
                            Mark ex-employee
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-mist-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
                          >
                            <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />
                            Reactivate
                          </button>
                        )}
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="h-fit p-6">
          <h2 className="font-serif text-lg font-semibold text-mist-950">Add a therapist</h2>
          <p className="mt-1 text-sm text-mist-700">They'll appear in booking assignments right away.</p>
          <div className="mt-5">
            <AddTherapistForm />
          </div>
        </Card>
      </div>

      {isOwner && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-serif text-lg font-semibold text-mist-950">Roles & module access</h2>
                <p className="mt-1 text-sm text-mist-700">Create or edit roles so each team member sees only the modules they need.</p>
              </div>
            </div>
            <div className="mt-6">
              <RoleManager roles={db.roles ?? []} />
            </div>
          </Card>

          <div className="grid gap-6 xl:grid-cols-3">
            <Card className="p-6 xl:col-span-2">
            <h2 className="font-serif text-lg font-semibold text-mist-950">Back-office users</h2>
            <p className="mt-1 text-sm text-mist-700">
              Staff see bookings, stays, reports and inventory. Managers also get invoices, receipts, finance and this team page. Owners manage users. The root <span className="font-medium">admin</span> account always works with the password in <code className="rounded bg-mist-100 px-1">.env.local</code>.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-mist-200 text-xs font-semibold uppercase tracking-wide text-mist-600">
                    <th className="pb-3 pr-4">Name</th>
                    <th className="pb-3 pr-4">Username</th>
                    <th className="pb-3 pr-4">Role</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mist-100">
                  {db.users.map((u) => (
                    <tr key={u.id} className={u.active ? undefined : "opacity-70"}>
                      <td className="py-3.5 pr-4 font-medium text-mist-950">{u.name}</td>
                      <td className="py-3.5 pr-4 text-mist-800">{u.username}</td>
                      <td className="py-3.5 pr-4 text-mist-800">{u.role}</td>
                      <td className="py-3.5 pr-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                            u.active
                              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                              : "border-slate-200 bg-slate-100 text-slate-600"
                          }`}
                        >
                          {u.active ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <form action={setUserActive} className="flex justify-end">
                          <input type="hidden" name="id" value={u.id} />
                          <input type="hidden" name="active" value={String(!u.active)} />
                          <button
                            type="submit"
                            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors duration-200 ${
                              u.active
                                ? "border border-mist-300 text-mist-700 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                                : "bg-mist-600 text-white hover:bg-mist-700"
                            }`}
                          >
                            {u.active ? (
                              <>
                                <UserX className="h-3.5 w-3.5" aria-hidden="true" />
                                Disable
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />
                                Enable
                              </>
                            )}
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                  {db.users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-mist-600">
                        No extra users yet — only the root admin account.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

            <Card className="h-fit p-6">
              <h2 className="font-serif text-lg font-semibold text-mist-950">Add a user</h2>
              <p className="mt-1 text-sm text-mist-700">They sign in at /login with their own password.</p>
              <div className="mt-5">
                <AddUserForm roleOptions={[...new Set(["Staff", "Manager", "Owner", ...(db.roles ?? []).map((role) => role.name)])]} />
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
