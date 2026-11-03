import { Account, AppwriteException, Client, ExecutionMethod, Functions, ID, Locale, Storage } from "appwrite";
import { backendConfig } from "./config";
import type { Sdk } from "./sdk-types";

const client = new Client().setEndpoint(backendConfig.endpoint).setProject(backendConfig.projectId);

const account = new Account(client);
const functions = new Functions(client);
const locale = new Locale(client);
const storage = new Storage(client);

const isGuest = (err: unknown) => err instanceof AppwriteException && (err.code === 401 || err.code === 403);

export const sdk: Sdk = {
  async execute({ method, path, body, headers }) {
    const execution = await functions.createExecution({
      functionId: backendConfig.functionId,
      body: body ?? "",
      async: false,
      xpath: path,
      method: method as ExecutionMethod,
      headers,
    });
    return { status: execution.responseStatusCode, body: execution.responseBody };
  },
  async sendEmailCode(email) {
    const token = await account.createEmailToken({ userId: ID.unique(), email });
    return token.userId;
  },
  async signIn(userId, code) {
    await account.createSession({ userId, secret: code });
  },
  async signOut() {
    await account.deleteSession({ sessionId: "current" });
  },
  async currentUser() {
    try {
      const user = await account.get();
      return { id: user.$id, email: user.email, name: user.name };
    } catch (err) {
      if (isGuest(err)) return null;
      throw err;
    }
  },
  async countryCode() {
    const current = await locale.get();
    return current.countryCode || null;
  },
  subscribe(channels, onEvent) {
    return client.subscribe(channels, (event) => onEvent({ events: event.events, payload: event.payload }));
  },
  async uploadPhoto(photo) {
    if (!(photo.file instanceof File)) throw new Error("No file was picked");
    const file = await storage.createFile({ bucketId: backendConfig.cakePhotosBucketId, fileId: ID.unique(), file: photo.file });
    return file.$id;
  },
};
