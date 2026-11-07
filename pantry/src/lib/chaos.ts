/**
 * Every unpredictable behaviour of Pantry goes through here, so CHAOS.md can list it and one setting can
 * switch it off. A draw is a hash of (seed, behaviour, round): same seed and round, same outcome.
 */

export type ChaosMode = "on" | "off";

export interface ChaosSettings {
  mode: ChaosMode;
  seed: string;
  /** Picks the A/B variants: one per build, like a real experiment assigns a user once. */
  variantSeed: string;
}

/** Changing it moves every build made after to new A/B variants. */
export const BUILD_VARIANT_SEED = "pantry-1";

const VARIANTS: ReadonlySet<Behaviour> = new Set(["bannerVariantB", "addLabelVariantB", "checkoutButtonsSwapped"]);

export const DEFAULT_PROBABILITIES = {
  whatsNew: 0.3,
  bannerVariantB: 0.5,
  addLabelVariantB: 0.5,
  checkoutButtonsSwapped: 0.5,
  ordersError: 0.15,
} as const;

export const DELAYS_MS = {
  prices: [0, 4000],
  images: [0, 6000],
  orderStatus: [0, 8000],
} as const;

export type Behaviour = keyof typeof DEFAULT_PROBABILITIES;
export type Delay = keyof typeof DELAYS_MS;

export function settingsFrom(env: { mode?: string; seed?: string }, installSeed: string): ChaosSettings {
  const fixed = env.seed?.trim();
  return {
    mode: env.mode?.trim().toLowerCase() === "off" ? "off" : "on",
    seed: fixed || installSeed,
    variantSeed: fixed || BUILD_VARIANT_SEED,
  };
}

/** A number in [0, 1) from the seed, the behaviour name and the round (launch, order count, ...). */
export function unit(seed: string, name: string, round: number | string = 0): number {
  let h = 2166136261;
  for (const ch of `${seed}|${name}|${round}`) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 13;
  h = Math.imul(h, 0x5bd1e995);
  h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}

export function happens(settings: ChaosSettings, behaviour: Behaviour, round: number | string = 0): boolean {
  if (settings.mode === "off") return false;
  const seed = VARIANTS.has(behaviour) ? settings.variantSeed : settings.seed;
  return unit(seed, behaviour, round) < DEFAULT_PROBABILITIES[behaviour];
}

export function delayMs(settings: ChaosSettings, delay: Delay, round: number | string = 0): number {
  if (settings.mode === "off") return 0;
  const [min, max] = DELAYS_MS[delay];
  return Math.floor(min + unit(settings.seed, delay, round) * (max - min));
}

/** The order the "Recommended" row shows its products in; stable when chaos is off. */
export function shuffled<T>(settings: ChaosSettings, items: readonly T[], round: number | string): T[] {
  const out = [...items];
  if (settings.mode === "off") return out;
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(unit(settings.seed, "recommended", `${round}:${i}`) * (i + 1));
    [out[i], out[j]] = [out[j] as T, out[i] as T];
  }
  return out;
}

export function newInstallSeed(): string {
  return Math.random().toString(36).slice(2, 10);
}
