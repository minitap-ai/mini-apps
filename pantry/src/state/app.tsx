import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ACCOUNTS, type Account } from "@/lib/accounts";
import { newInstallSeed, settingsFrom, type ChaosSettings } from "@/lib/chaos";
import type { Address, Order } from "@/lib/orders";
import type { CartLine } from "@/lib/pricing";

const KEY = "pantry/state/v1";

export type Consent = "all" | "essential";

export interface Prefs {
  orderUpdates: boolean;
  offers: boolean;
  newsletter: boolean;
}

export interface Persisted {
  installSeed: string;
  launches: number;
  onboardingDone: boolean;
  consent: Consent | null;
  consentAskedAt: number | null;
  whatsNewSeenAt: number | null;
  notificationsAsked: boolean;
  email: string | null;
  names: Record<string, string>;
  addresses: Record<string, Address>;
  prefs: Record<string, Prefs>;
  cart: CartLine[];
  promoCode: string | null;
  orders: Record<string, Order[]>;
  ratingAnswered: Record<string, boolean>;
}

const EMPTY: Persisted = {
  installSeed: "",
  launches: 0,
  onboardingDone: false,
  consent: null,
  consentAskedAt: null,
  whatsNewSeenAt: null,
  notificationsAsked: false,
  email: null,
  names: {},
  addresses: {},
  prefs: {},
  cart: [],
  promoCode: null,
  orders: {},
  ratingAnswered: {},
};

export const DEFAULT_PREFS: Prefs = { orderUpdates: true, offers: false, newsletter: false };

interface AppState {
  ready: boolean;
  data: Persisted;
  chaos: ChaosSettings;
  account: Account | null;
  update: (change: (current: Persisted) => Persisted) => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Persisted>(EMPTY);
  const [ready, setReady] = useState(false);
  const latest = useRef(data);

  useEffect(() => {
    void (async () => {
      const raw = await AsyncStorage.getItem(KEY).catch(() => null);
      const stored = raw ? ({ ...EMPTY, ...(JSON.parse(raw) as Partial<Persisted>) } as Persisted) : EMPTY;
      const next = { ...stored, installSeed: stored.installSeed || newInstallSeed(), launches: stored.launches + 1 };
      latest.current = next;
      setData(next);
      setReady(true);
      await AsyncStorage.setItem(KEY, JSON.stringify(next));
    })();
  }, []);

  const update = useCallback((change: (current: Persisted) => Persisted) => {
    const next = change(latest.current);
    latest.current = next;
    setData(next);
    void AsyncStorage.setItem(KEY, JSON.stringify(next));
  }, []);

  const chaos = useMemo(
    () =>
      settingsFrom(
        { mode: process.env.EXPO_PUBLIC_CHAOS, seed: process.env.EXPO_PUBLIC_CHAOS_SEED },
        data.installSeed,
      ),
    [data.installSeed],
  );
  const account = ACCOUNTS.find((a) => a.email === data.email) ?? null;

  return <Ctx.Provider value={{ ready, data, chaos, account, update }}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const value = useContext(Ctx);
  if (!value) throw new Error("useApp outside AppStateProvider");
  return value;
}

export function useUser() {
  const { data, account, update } = useApp();
  const email = account?.email ?? null;
  return {
    account,
    name: email ? (data.names[email] ?? account?.name ?? "") : "",
    address: email ? data.addresses[email] : undefined,
    prefs: (email && data.prefs[email]) || DEFAULT_PREFS,
    orders: (email && data.orders[email]) || [],
    signIn: (a: Account) => update((d) => ({ ...d, email: a.email })),
    signOut: () => update((d) => ({ ...d, email: null, cart: [], promoCode: null })),
    setName: (name: string) => email && update((d) => ({ ...d, names: { ...d.names, [email]: name } })),
    setAddress: (address: Address) => email && update((d) => ({ ...d, addresses: { ...d.addresses, [email]: address } })),
    setPrefs: (prefs: Prefs) => email && update((d) => ({ ...d, prefs: { ...d.prefs, [email]: prefs } })),
    deleteAccount: () =>
      email &&
      update((d) => {
        const drop = <T,>(r: Record<string, T>) => Object.fromEntries(Object.entries(r).filter(([k]) => k !== email));
        return { ...d, email: null, cart: [], promoCode: null, names: drop(d.names), addresses: drop(d.addresses), prefs: drop(d.prefs), orders: drop(d.orders), ratingAnswered: drop(d.ratingAnswered) };
      }),
  };
}
