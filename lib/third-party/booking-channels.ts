import type { ChannelIntegrationSetting } from "../db";

export type ThirdPartyProvider = "airbnb" | "booking.com" | "expedia";

export interface ThirdPartyBookingPayload {
  provider: ThirdPartyProvider;
  bookingId: string;
  reference: string;
  suiteId: string;
  suiteName: string;
  guest: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  total: number;
  notes?: string;
  status: string;
}

export interface ThirdPartySyncResult {
  provider: ThirdPartyProvider;
  ok: boolean;
  status: "disabled" | "sent" | "failed";
  message: string;
}

interface ThirdPartyConnectorConfig {
  endpoint: string | undefined;
  apiKey: string | undefined;
  enabled: boolean;
}

function getConnectorConfig(provider: ThirdPartyProvider, setting?: ChannelIntegrationSetting): ThirdPartyConnectorConfig {
  const fallback = {
    endpoint: process.env[`${provider.toUpperCase().replace(/\./g, "_")}_API_URL`]?.trim(),
    apiKey: process.env[`${provider.toUpperCase().replace(/\./g, "_")}_API_KEY`]?.trim(),
  };

  return {
    endpoint: setting?.endpoint?.trim() || fallback.endpoint,
    apiKey: setting?.apiKey?.trim() || fallback.apiKey,
    enabled: setting?.enabled ?? false,
  };
}

export async function sendBookingToThirdParty(
  provider: ThirdPartyProvider,
  payload: ThirdPartyBookingPayload,
  setting?: ChannelIntegrationSetting
): Promise<ThirdPartySyncResult> {
  const config = getConnectorConfig(provider, setting);
  if (!config.enabled) {
    return {
      provider,
      ok: true,
      status: "disabled",
      message: `${provider} is currently disabled.`,
    };
  }

  if (!config.endpoint) {
    return {
      provider,
      ok: false,
      status: "failed",
      message: `Enabled ${provider} connector is missing an endpoint.`,
    };
  }

  try {
    const response = await fetch(config.endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-source": "mamoyo-spa",
        ...(config.apiKey ? { "x-api-key": config.apiKey } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return {
      provider,
      ok: true,
      status: "sent",
      message: `Sent to ${provider}.`,
    };
  } catch (error) {
    return {
      provider,
      ok: false,
      status: "failed",
      message: `Unable to sync to ${provider}: ${error instanceof Error ? error.message : "unknown error"}`,
    };
  }
}
