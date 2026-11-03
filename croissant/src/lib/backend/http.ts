import type { Transport } from "./api";

/** Plain HTTP transport, used against the local development API. */
export function httpTransport(baseUrl: string, userId: () => string | null): Transport {
  return async ({ method, path, body, headers }) => {
    const user = userId();
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      body,
      headers: user ? { ...headers, "x-appwrite-user-id": user } : headers,
    });
    return { status: response.status, body: await response.text() };
  };
}
