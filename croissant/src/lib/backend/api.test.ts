import { describe, expect, it } from "vitest";
import { ApiError, createApi, query, type TransportRequest } from "./api";

function fakeApi(status: number, body: unknown, seen: TransportRequest[] = []) {
  return createApi(
    async (request) => {
      seen.push(request);
      return { status, body: typeof body === "string" ? body : JSON.stringify(body) };
    },
    { clientId: async () => "client-123", platform: "android" },
  );
}

describe("createApi", () => {
  it("sends the client headers on every call", async () => {
    const seen: TransportRequest[] = [];
    await fakeApi(200, { ok: true }, seen).home();
    expect(seen[0]?.headers).toMatchObject({ "x-client-id": "client-123", "x-client-platform": "android" });
    expect(seen[0]?.method).toBe("GET");
    expect(seen[0]?.path).toBe("/home");
  });

  it("serialises bodies and path parameters", async () => {
    const seen: TransportRequest[] = [];
    const api = fakeApi(200, {}, seen);
    await api.addToCart("pain-au-chocolat", 2);
    await api.setQuantity("a b", 0);
    expect(seen[0]?.body).toBe(JSON.stringify({ productId: "pain-au-chocolat", qty: 2 }));
    expect(seen[1]).toMatchObject({ method: "PATCH", path: "/cart/items/a%20b" });
  });

  it("puts the country in the query string", async () => {
    const seen: TransportRequest[] = [];
    await fakeApi(200, {}, seen).menu("FR");
    await fakeApi(200, {}, seen).menu();
    expect(seen.map((r) => r.path)).toEqual(["/menu?country=FR", "/menu"]);
  });

  it("turns error bodies into ApiError with the server message", async () => {
    const err = await fakeApi(503, { error: { code: "UNAVAILABLE", message: "Try again later" } })
      .hours()
      .catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toMatchObject({ status: 503, code: "UNAVAILABLE", message: "Try again later" });
  });

  it("flags sign-in errors", async () => {
    const err = (await fakeApi(401, { error: { code: "UNAUTHENTICATED", message: "Sign in" } })
      .loyalty()
      .catch((e: unknown) => e)) as ApiError;
    expect(err.needsSignIn).toBe(true);
  });

  it("uses a friendly message when the body is not JSON", async () => {
    const err = await fakeApi(500, "<html>").legal().catch((e: unknown) => e);
    expect(err).toMatchObject({ status: 500, code: "HTTP_500" });
  });

  it("reports transport failures as network errors", async () => {
    const api = createApi(
      async () => {
        throw new Error("socket closed");
      },
      { clientId: async () => "x", platform: "web" },
    );
    await expect(api.home()).rejects.toMatchObject({ code: "NETWORK", status: 0 });
  });
});

describe("query", () => {
  it("skips empty values and encodes the rest", () => {
    expect(query({ a: "1", b: undefined, c: "x y" })).toBe("?a=1&c=x%20y");
    expect(query({})).toBe("");
  });
});
