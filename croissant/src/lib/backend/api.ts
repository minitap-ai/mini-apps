import type {
  Board,
  Cake,
  CakeSize,
  Cart,
  DailyProduct,
  Family,
  Fulfilment,
  Home,
  Hours,
  Legal,
  Loyalty,
  Menu,
  Order,
  OrderStatus,
  Photo,
  Prices,
  Product,
  Quote,
  Reward,
} from "./types";

export type Method = "GET" | "POST" | "PATCH" | "DELETE";

export interface TransportRequest {
  method: Method;
  path: string;
  body?: string;
  headers: Record<string, string>;
}

export interface TransportResponse {
  status: number;
  body: string;
}

/** Sends one request to the bakery API and returns its raw status and body. */
export type Transport = (request: TransportRequest) => Promise<TransportResponse>;

export interface ClientIdentity {
  clientId: () => Promise<string>;
  platform: string;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }

  get needsSignIn(): boolean {
    return this.status === 401;
  }
}

const FALLBACK_MESSAGE = "Something went wrong. Please try again.";
const OFFLINE_MESSAGE = "We couldn't reach the bakery. Check your connection and try again.";

function parse(text: string): unknown {
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

function errorFrom(status: number, payload: unknown): ApiError {
  const error = (payload as { error?: { code?: unknown; message?: unknown } } | undefined)?.error;
  const code = typeof error?.code === "string" ? error.code : `HTTP_${status}`;
  const message = typeof error?.message === "string" && error.message ? error.message : FALLBACK_MESSAGE;
  return new ApiError(status, code, message);
}

export function query(params: Record<string, string | undefined>): string {
  const entries = Object.entries(params).filter((entry): entry is [string, string] => Boolean(entry[1]));
  if (entries.length === 0) return "";
  return `?${entries.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&")}`;
}

export function createApi(transport: Transport, identity: ClientIdentity) {
  async function request<T>(method: Method, path: string, body?: unknown): Promise<T> {
    const headers: Record<string, string> = {
      "content-type": "application/json",
      "x-client-id": await identity.clientId(),
      "x-client-platform": identity.platform,
    };
    let response: TransportResponse;
    try {
      response = await transport({ method, path, headers, body: body === undefined ? undefined : JSON.stringify(body) });
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(0, "NETWORK", OFFLINE_MESSAGE);
    }
    const payload = parse(response.body);
    if (response.status >= 400 || response.status === 0) throw errorFrom(response.status, payload);
    return payload as T;
  }

  const get = <T>(path: string) => request<T>("GET", path);
  const post = <T>(path: string, body: unknown = {}) => request<T>("POST", path, body);

  return {
    request,
    home: () => get<Home>("/home"),
    menu: (country?: string) => get<Menu>(`/menu${query({ country })}`),
    prices: (country?: string) => get<Prices>(`/menu/prices${query({ country })}`),
    product: (id: string) => get<{ product: Product }>(`/products/${encodeURIComponent(id)}`),
    daily: () => get<{ product: DailyProduct }>("/daily"),
    dailyPhoto: () => get<Photo>("/daily/photo"),
    cart: () => get<{ cart: Cart }>("/cart"),
    addToCart: (productId: string, qty = 1) => post<{ cart: Cart; toastMs?: number }>("/cart/items", { productId, qty }),
    setQuantity: (productId: string, qty: number) =>
      request<{ cart: Cart }>("PATCH", `/cart/items/${encodeURIComponent(productId)}`, { qty }),
    quote: (fulfilment: Fulfilment) => post<{ quote: Quote }>("/checkout/quote", { fulfilment }),
    placeOrder: (quoteId: string) => post<{ order: Order }>("/checkout", { quoteId }),
    orders: () => get<{ orders: Order[] }>("/orders"),
    order: (id: string) => get<{ order: Order }>(`/orders/${encodeURIComponent(id)}`),
    orderStatus: (id: string) => get<OrderStatus>(`/orders/${encodeURIComponent(id)}/status`),
    legal: () => get<Legal>("/legal"),
    hours: () => get<Hours>("/hours"),
    loyalty: () => get<Loyalty>("/loyalty"),
    redeem: (rewardId: string) => post<{ points: number; redeemed: Reward }>("/loyalty/redeem", { rewardId }),
    sendSms: (phone: string) => post<{ message: string }>("/auth/sms", { phone }),
    family: () => get<Family>("/family"),
    startFamilyOrder: (items: string, placedBy?: string) =>
      post<{ accepted: boolean; id: string }>("/family/orders", { items, placedBy }),
    requestCake: (size: CakeSize, message: string, fileId: string) => post<{ cake: Cake }>("/cakes", { size, message, fileId }),
    cake: (id: string) => get<{ cake: Cake }>(`/cakes/${encodeURIComponent(id)}`),
    board: () => get<Board>("/board"),
  };
}

export type Api = ReturnType<typeof createApi>;
