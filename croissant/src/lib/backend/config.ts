// Public Appwrite identifiers. They are compiled in so a plain clone builds with no
// environment variables; EXPO_PUBLIC_* values override them for local work.

export const APPWRITE_PROJECT_ID = "6ae9fdf600101edd346b";

const env = (value: string | undefined): string | undefined => (value && value.trim() ? value.trim() : undefined);

export const backendConfig = {
  endpoint: env(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT) ?? "https://fra.cloud.appwrite.io/v1",
  projectId: env(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID) ?? APPWRITE_PROJECT_ID,
  functionId: env(process.env.EXPO_PUBLIC_APPWRITE_FUNCTION_ID) ?? "api",
  databaseId: "croissant",
  cakePhotosBucketId: "cake-photos",
  familyOrdersTableId: "family_orders",
  /** Base URL of a plain HTTP API (local development server). Unset = Appwrite executions. */
  apiUrl: env(process.env.EXPO_PUBLIC_API_URL)?.replace(/\/+$/, ""),
  bundleId: "ai.minitap.croissant",
} as const;
