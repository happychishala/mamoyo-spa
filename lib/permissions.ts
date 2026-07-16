export type AdminModule =
  | "dashboard"
  | "calendar"
  | "bookings"
  | "stays"
  | "reports"
  | "inventory"
  | "pos"
  | "invoices"
  | "receipts"
  | "finance"
  | "tax"
  | "team"
  | "integrations";

export interface RoleDefinition {
  id: string;
  name: string;
  description?: string;
  modules: AdminModule[];
  rank: number;
  isSystemRole: boolean;
}

export const ADMIN_MODULES: Array<{ id: AdminModule; label: string; description: string }> = [
  { id: "dashboard", label: "Dashboard", description: "Overview and KPIs" },
  { id: "calendar", label: "Calendar", description: "Bookings calendar" },
  { id: "bookings", label: "Bookings", description: "Treatments and bookings" },
  { id: "stays", label: "Stays", description: "Suite stays" },
  { id: "reports", label: "Reports", description: "Reports and therapist view" },
  { id: "inventory", label: "Inventory", description: "Stock and supplies" },
  { id: "pos", label: "POS", description: "Cafe point of sale" },
  { id: "invoices", label: "Invoices", description: "Billing and invoice management" },
  { id: "receipts", label: "Receipts", description: "Receipt records and printing" },
  { id: "finance", label: "Finance", description: "Transactions and finance" },
  { id: "tax", label: "Tax", description: "Tax reporting" },
  { id: "team", label: "Team", description: "Therapists and user management" },
  { id: "integrations", label: "Integrations", description: "Third-party booking connectors" },
];

export function normalizeRoleName(value: string): string {
  return value.trim().replace(/\s+/g, " ").replace(/^\w/, (char) => char.toUpperCase());
}

export function getDefaultRoleDefinitions(): RoleDefinition[] {
  return [
    {
      id: "role-staff",
      name: "Staff",
      description: "Front-line operations access",
      modules: ["dashboard", "calendar", "bookings", "stays", "reports", "inventory", "pos"],
      rank: 0,
      isSystemRole: true,
    },
    {
      id: "role-manager",
      name: "Manager",
      description: "Operational lead with billing and team access",
      modules: [
        "dashboard",
        "calendar",
        "bookings",
        "stays",
        "reports",
        "inventory",
        "pos",
        "invoices",
        "receipts",
        "finance",
        "tax",
        "team",
        "integrations",
      ],
      rank: 1,
      isSystemRole: true,
    },
    {
      id: "role-owner",
      name: "Owner",
      description: "Full access to every admin module",
      modules: [
        "dashboard",
        "calendar",
        "bookings",
        "stays",
        "reports",
        "inventory",
        "pos",
        "invoices",
        "receipts",
        "finance",
        "tax",
        "team",
        "integrations",
      ],
      rank: 2,
      isSystemRole: true,
    },
  ];
}

function isAdminModule(value: string): value is AdminModule {
  return ADMIN_MODULES.some((module) => module.id === value);
}

export function getAllowedModules(
  roles: Array<{ name: string; modules: Array<string | AdminModule> }>,
  roleName: string
): AdminModule[] {
  if (roleName === "Owner") return ADMIN_MODULES.map((module) => module.id);

  const role = roles.find((item) => item.name === roleName);
  if (!role) {
    return (getDefaultRoleDefinitions().find((item) => item.name === roleName)?.modules ?? []).filter(isAdminModule);
  }

  return role.modules.filter(isAdminModule);
}

export function getRoleNameList(roles: RoleDefinition[]): string[] {
  return roles.map((role) => role.name);
}
