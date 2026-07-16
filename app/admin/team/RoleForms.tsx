"use client";

import { useActionState } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { createRole, updateRole, type ActionResult } from "@/lib/actions";
import type { RoleDefinitionRecord } from "@/lib/db";
import { ADMIN_MODULES } from "@/lib/permissions";

const inputClasses =
  "w-full rounded-xl border border-mist-200 bg-mist-50 px-3.5 py-2.5 text-sm text-mist-950 placeholder:text-mist-400 transition focus:border-mist-400 focus:outline-none";

function StatusNote({ state }: { state: ActionResult | null }) {
  if (!state) return null;
  return (
    <p
      role="status"
      className={`mt-4 flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-xs ${
        state.ok
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
    >
      {state.ok ? <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" /> : <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
      {state.message}
    </p>
  );
}

function SubmitButton({ pending, label, secondary = false }: { pending: boolean; label: string; secondary?: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={`mt-5 inline-flex items-center rounded-full px-4 py-2.5 text-sm font-semibold transition ${secondary ? "border border-mist-300 text-mist-700 hover:border-mist-400 hover:bg-mist-50" : "bg-mist-600 text-white hover:bg-mist-700"} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? "Saving…" : label}
    </button>
  );
}

function ModuleCheckboxes({ selectedModules }: { selectedModules: string[] }) {
  return (
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      {ADMIN_MODULES.map((module) => (
        <label
          key={module.id}
          className="flex items-start gap-2 rounded-2xl border border-mist-200 bg-mist-50 p-3 text-sm text-mist-800"
        >
          <input
            type="checkbox"
            name="module"
            value={module.id}
            defaultChecked={selectedModules.includes(module.id)}
            className="mt-1 h-4 w-4 rounded border-mist-300 text-mist-600"
          />
          <span>
            <span className="block font-medium text-mist-950">{module.label}</span>
            <span className="mt-0.5 block text-xs text-mist-600">{module.description}</span>
          </span>
        </label>
      ))}
    </div>
  );
}

function RoleForm({ role }: { role: RoleDefinitionRecord }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(updateRole, null);

  return (
    <form action={formAction} className="rounded-2xl border border-mist-200 bg-white p-5 shadow-soft">
      <input type="hidden" name="roleId" value={role.id} />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-lg font-semibold text-mist-950">{role.name}</h3>
          <p className="mt-1 text-sm text-mist-700">{role.description || "Custom access level for the back office."}</p>
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${role.isSystemRole ? "border-mist-200 bg-mist-50 text-mist-700" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>
          {role.isSystemRole ? "Built-in" : "Custom"}
        </span>
      </div>

      <ModuleCheckboxes selectedModules={role.modules} />
      <StatusNote state={state} />
      <SubmitButton pending={pending} label="Save access" secondary />
    </form>
  );
}

export function RoleManager({ roles }: { roles: RoleDefinitionRecord[] }) {
  const [createState, createAction, createPending] = useActionState<ActionResult | null, FormData>(createRole, null);

  return (
    <div className="space-y-4">
      <form action={createAction} className="rounded-2xl border border-mist-200 bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-lg font-semibold text-mist-950">Add a new role</h3>
            <p className="mt-1 text-sm text-mist-700">Create a role and decide which admin modules it can access.</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-mist-800">Role name</span>
            <input name="name" type="text" required placeholder="Operations lead" className={inputClasses} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-mist-800">Description</span>
            <input name="description" type="text" placeholder="What this role is used for" className={inputClasses} />
          </label>
        </div>

        <ModuleCheckboxes selectedModules={[]} />
        <StatusNote state={createState} />
        <SubmitButton pending={createPending} label="Create role" />
      </form>

      <div className="space-y-4">
        {roles.map((role) => (
          <RoleForm key={role.id} role={role} />
        ))}
      </div>
    </div>
  );
}
