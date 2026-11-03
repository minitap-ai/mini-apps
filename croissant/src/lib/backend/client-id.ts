import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";

const KEY = "croissant.client-id";
let cached: Promise<string> | null = null;

/** A random id created on first launch and kept for the life of this install. */
export function clientId(): Promise<string> {
  cached ??= (async () => {
    const existing = await AsyncStorage.getItem(KEY).catch(() => null);
    if (existing) return existing;
    const created = randomUUID();
    await AsyncStorage.setItem(KEY, created).catch(() => undefined);
    return created;
  })();
  return cached;
}
