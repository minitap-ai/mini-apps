import type { TransportRequest, TransportResponse } from "./api";
import type { User } from "./types";

/** A photo picked from the library. `file` is the browser File on web. */
export interface PickedPhoto {
  uri: string;
  name: string;
  type: string;
  size: number;
  file?: unknown;
}

export interface RealtimeEvent {
  events: string[];
  payload: unknown;
}

/** What the app needs from Appwrite, implemented by the native and the web SDK. */
export interface Sdk {
  execute(request: TransportRequest): Promise<TransportResponse>;
  sendEmailCode(email: string): Promise<string>;
  signIn(userId: string, code: string): Promise<void>;
  signOut(): Promise<void>;
  currentUser(): Promise<User | null>;
  countryCode(): Promise<string | null>;
  subscribe(channels: string[], onEvent: (event: RealtimeEvent) => void): () => void;
  uploadPhoto(photo: PickedPhoto): Promise<string>;
}
