import { Platform } from "react-native";
import { createApi } from "./api";
import { clientId } from "./client-id";
import { backendConfig } from "./config";
import { httpTransport } from "./http";
import { sdk } from "./sdk";
import type { PickedPhoto, RealtimeEvent } from "./sdk-types";
import { familyOrderFromRow, type FamilyOrderRow } from "./rows";
import type { FamilyOrder, User } from "./types";

export { ApiError } from "./api";
export type { PickedPhoto } from "./sdk-types";
export * from "./types";

let signedInUserId: string | null = null;

const transport = backendConfig.apiUrl ? httpTransport(backendConfig.apiUrl, () => signedInUserId) : sdk.execute;

export const api = createApi(transport, { clientId, platform: Platform.OS });

export const auth = {
  async current(): Promise<User | null> {
    const user = await sdk.currentUser().catch(() => null);
    signedInUserId = user?.id ?? null;
    return user;
  },
  sendEmailCode: (email: string) => sdk.sendEmailCode(email.trim()),
  async signIn(userId: string, code: string): Promise<User | null> {
    await sdk.signIn(userId, code.trim());
    return auth.current();
  },
  async signOut(): Promise<void> {
    await sdk.signOut().catch(() => undefined);
    signedInUserId = null;
  },
};

export const locale = {
  countryCode: () => sdk.countryCode(),
};

export const storage = {
  uploadCakePhoto: (photo: PickedPhoto) => sdk.uploadPhoto(photo),
};

const { databaseId, familyOrdersTableId } = backendConfig;
const FAMILY_ORDER_CHANNELS = [
  `databases.${databaseId}.tables.${familyOrdersTableId}.rows`,
  `databases.${databaseId}.collections.${familyOrdersTableId}.documents`,
];

export const realtime = {
  /** Calls `onOrder` for every family order created while subscribed. */
  familyOrders(onOrder: (order: FamilyOrder) => void): () => void {
    return sdk.subscribe(FAMILY_ORDER_CHANNELS, (event: RealtimeEvent) => {
      if (!event.events.some((name) => name.endsWith(".create"))) return;
      const order = familyOrderFromRow(event.payload as FamilyOrderRow);
      if (order) onOrder(order);
    });
  },
};
