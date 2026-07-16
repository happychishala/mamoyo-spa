import { readDb, type StayBooking } from "./db";
import {
  sendBookingToThirdParty,
  type ThirdPartyProvider,
  type ThirdPartySyncResult,
  type ThirdPartyBookingPayload,
} from "./third-party/booking-channels";

export type ChannelProvider = ThirdPartyProvider;

export interface ChannelSyncResult extends ThirdPartySyncResult {}

export async function syncStayToChannels(
  stay: StayBooking,
  suiteName: string,
  suiteId: string
): Promise<ChannelSyncResult[]> {
  const db = await readDb();
  const providers: ChannelProvider[] = ["airbnb", "booking.com", "expedia"];
  const payload: ThirdPartyBookingPayload = {
    provider: "airbnb",
    bookingId: stay.id,
    reference: stay.ref,
    suiteId,
    suiteName,
    guest: stay.guest,
    email: stay.email,
    phone: stay.phone,
    checkIn: stay.checkIn,
    checkOut: stay.checkOut,
    guests: stay.guests,
    nights: stay.nights,
    total: stay.total,
    notes: stay.notes,
    status: stay.status,
  };

  const results = await Promise.all(
    providers.map(async (provider) => {
      const setting = db.channelIntegrations?.find((item) => item.provider === provider);
      const result = await sendBookingToThirdParty(provider, {
        ...payload,
        provider,
      }, setting);

      if (setting) {
        setting.lastStatus = result.status;
        setting.lastMessage = result.message;
        setting.lastSyncedAt = new Date().toISOString();
      }

      return result;
    })
  );

  await Promise.all(
    providers.map(async (provider) => {
      const setting = db.channelIntegrations?.find((item) => item.provider === provider);
      if (!setting) return;
      await import("./db").then(({ writeDb }) => writeDb(db));
    })
  );

  return results;
}
