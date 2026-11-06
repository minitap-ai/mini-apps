import { happens, type ChaosSettings } from "@/lib/chaos";
import type { Persisted } from "@/state/app";

export type Interruption = "consent" | "notifications" | "whats-new" | null;

/**
 * What the home screen asks for next, one at a time: the cookie choice on first launch (and again every
 * third launch for someone who kept only essential cookies), then the notification permission once per
 * install, then on some launches the "What's new" sheet.
 */
export function nextInterruption(data: Persisted, chaos: ChaosSettings): Interruption {
  if (data.consent === null) return "consent";
  if (data.consent === "essential" && data.launches % 3 === 0 && data.consentAskedAt !== data.launches) return "consent";
  if (!data.notificationsAsked) return "notifications";
  if (data.whatsNewSeenAt !== data.launches && happens(chaos, "whatsNew", data.launches)) return "whats-new";
  return null;
}
