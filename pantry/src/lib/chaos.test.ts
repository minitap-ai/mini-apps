import { describe, expect, it } from "vitest";
import { nextInterruption } from "../ui/interruptions";
import { BUILD_VARIANT_SEED, delayMs, happens, settingsFrom, shuffled } from "./chaos";

const on = settingsFrom({ seed: "seed-42" }, "install");
const off = settingsFrom({ mode: "off", seed: "seed-42" }, "install");

describe("chaos", () => {
  it("draws the same outcome for the same seed and round, and differs across rounds", () => {
    const rounds = Array.from({ length: 40 }, (_, i) => happens(on, "whatsNew", i));
    expect(Array.from({ length: 40 }, (_, i) => happens(on, "whatsNew", i))).toEqual(rounds);
    expect(new Set(rounds).size).toBe(2);
  });

  it("control mode switches every random behaviour and delay off", () => {
    expect([happens(off, "whatsNew", 3), happens(off, "bannerVariantB"), happens(off, "ordersError", 1)]).toEqual([false, false, false]);
    expect(delayMs(off, "prices", 1)).toBe(0);
    expect(shuffled(off, [1, 2, 3, 4], 7)).toEqual([1, 2, 3, 4]);
  });

  it("an env seed replaces the install's own seed", () => {
    expect(settingsFrom({ seed: " fixed " }, "install").seed).toBe("fixed");
    expect(settingsFrom({}, "install")).toEqual({ mode: "on", seed: "install", variantSeed: BUILD_VARIANT_SEED });
  });

  it("every install of a build shows the same A/B variants, yet its own per-launch draws", () => {
    const installs = Array.from({ length: 20 }, (_, i) => settingsFrom({}, `install-${i}`));
    for (const variant of ["bannerVariantB", "addLabelVariantB", "checkoutButtonsSwapped"] as const) {
      expect(new Set(installs.map((s) => happens(s, variant))).size).toBe(1);
    }
    expect(new Set(installs.map((s) => happens(s, "whatsNew", 1))).size).toBe(2);
    expect(new Set(installs.map((s) => shuffled(s, [1, 2, 3, 4, 5], 1).join())).size).toBeGreaterThan(1);
  });
});

describe("home interruptions", () => {
  const base = { consent: null, consentAskedAt: null, notificationsAsked: false, whatsNewSeenAt: null, launches: 1 } as const;
  const data = (over: object) => ({ ...base, ...over }) as Parameters<typeof nextInterruption>[0];

  it("asks for cookies first, then notifications, one at a time", () => {
    expect(nextInterruption(data({}), off)).toBe("consent");
    expect(nextInterruption(data({ consent: "all" }), off)).toBe("notifications");
    expect(nextInterruption(data({ consent: "all", notificationsAsked: true }), off)).toBeNull();
  });

  it("asks again every third launch someone kept only essential cookies", () => {
    const essential = { consent: "essential", consentAskedAt: 1, notificationsAsked: true };
    expect(nextInterruption(data({ ...essential, launches: 3 }), off)).toBe("consent");
    expect(nextInterruption(data({ ...essential, launches: 3, consentAskedAt: 3 }), off)).toBeNull();
    expect(nextInterruption(data({ ...essential, launches: 4 }), off)).toBeNull();
  });
});
