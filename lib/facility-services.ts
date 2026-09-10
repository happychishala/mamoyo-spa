// Facility-access services that don't need a therapist assigned — the guest
// just uses the space. Matched by name prefix (case-insensitive) so option
// labels like "Steam Room — 60 min" still count. Client-safe (no server deps).
export const NO_THERAPIST_SERVICES = ["jacuzzi", "steam room", "swimming"] as const;

/** True when a service name is a facility-only item (no therapist needed). */
export function isFacilityService(name: string): boolean {
  const n = name.trim().toLowerCase();
  return NO_THERAPIST_SERVICES.some((base) => n.startsWith(base));
}

/**
 * Whether a booking needs a therapist: true if it has at least one hands-on
 * service that isn't a facility item. Facility-only bookings (jacuzzi, steam,
 * pool) and product-only bookings need none. Falls back to the legacy single
 * `service` string when there are no structured items.
 */
export function bookingNeedsTherapist(
  items: { name: string; kind: "service" | "product" }[] | undefined,
  service?: string
): boolean {
  if (items && items.length > 0) {
    return items.some((it) => it.kind === "service" && !isFacilityService(it.name));
  }
  return service ? !isFacilityService(service) : false;
}
