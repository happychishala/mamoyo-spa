import type { Metadata } from "next";
import { ShieldAlert, ServerCog, CheckCircle2, AlertTriangle } from "lucide-react";
import { readDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { updateChannelIntegrationSetting } from "@/lib/actions";
import { PageHeader, Card } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Integrations" };
export const dynamic = "force-dynamic";

const providerLabels: Record<string, string> = {
  airbnb: "Airbnb",
  "booking.com": "Booking.com",
  expedia: "Expedia",
};

const providerDescriptions: Record<string, string> = {
  airbnb: "Webhooks or channel-manager endpoints for Airbnb stays.",
  "booking.com": "Channel-manager endpoints for Booking.com reservations.",
  expedia: "Partner webhooks for Expedia syncs.",
};

export default async function IntegrationsPage() {
  const session = await getSession();
  if (!session || session.role === "Staff") {
    return (
      <Card className="mx-auto mt-20 max-w-md p-10 text-center">
        <ShieldAlert className="mx-auto h-8 w-8 text-mist-400" aria-hidden="true" />
        <h1 className="mt-4 font-serif text-xl font-semibold text-mist-950">Managers only</h1>
        <p className="mt-2 text-sm text-mist-700">Only managers and the owner can manage booking integrations.</p>
      </Card>
    );
  }

  const db = await readDb();
  const integrations = [...(db.channelIntegrations ?? [])].sort((a, b) => a.provider.localeCompare(b.provider));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Integrations"
        description="Turn third-party suite booking channels on or off, save their credentials, and review the last sync outcome."
      />

      <Card className="p-6">
        <div className="flex items-start gap-3">
          <ServerCog className="mt-0.5 h-5 w-5 text-mist-600" aria-hidden="true" />
          <div>
            <h2 className="font-serif text-lg font-semibold text-mist-950">Channel connectors</h2>
            <p className="mt-1 text-sm text-mist-700">Each provider can point to a webhook or channel-manager endpoint and use a shared API key.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {integrations.map((integration) => {
            const isEnabled = integration.enabled;
            const statusIcon = integration.lastStatus === "sent" ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : integration.lastStatus === "failed" ? <AlertTriangle className="h-4 w-4 text-red-600" /> : null;
            return (
              <div key={integration.provider} className="rounded-2xl border border-mist-200 bg-mist-50/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-mist-950">{providerLabels[integration.provider]}</h3>
                    <p className="mt-1 text-sm text-mist-700">{providerDescriptions[integration.provider]}</p>
                  </div>
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${isEnabled ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-600"}`}>
                    {isEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>

                <form action={updateChannelIntegrationSetting} className="mt-4 space-y-3">
                  <input type="hidden" name="provider" value={integration.provider} />
                  <label className="flex items-center gap-2 text-sm text-mist-800">
                    <input type="checkbox" name="enabled" value="true" defaultChecked={integration.enabled} className="h-4 w-4 rounded border-mist-300" />
                    Enable provider
                  </label>
                  <label className="block text-sm text-mist-700">
                    <span className="mb-1 block font-medium text-mist-800">Endpoint URL</span>
                    <input type="url" name="endpoint" defaultValue={integration.endpoint} placeholder="https://example.com/webhook" className="w-full rounded-xl border border-mist-300 px-3 py-2 text-sm outline-none focus:border-mist-500" />
                  </label>
                  <label className="block text-sm text-mist-700">
                    <span className="mb-1 block font-medium text-mist-800">API key</span>
                    <input type="text" name="apiKey" defaultValue={integration.apiKey} placeholder="Shared key or token" className="w-full rounded-xl border border-mist-300 px-3 py-2 text-sm outline-none focus:border-mist-500" />
                  </label>
                  <button type="submit" className="inline-flex cursor-pointer items-center rounded-full bg-mist-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mist-700">
                    Save settings
                  </button>
                </form>

                <div className="mt-4 rounded-xl border border-mist-200 bg-white p-3 text-sm text-mist-700">
                  <div className="flex items-center gap-2">
                    {statusIcon}
                    <span className="font-medium text-mist-900">Last sync</span>
                  </div>
                  <p className="mt-1 text-sm text-mist-600">{integration.lastMessage}</p>
                  {integration.lastSyncedAt ? <p className="mt-1 text-xs text-mist-500">{new Date(integration.lastSyncedAt).toLocaleString()}</p> : null}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
