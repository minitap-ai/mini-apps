const SYMBOLS: Record<string, string> = { EUR: "€", GBP: "£", USD: "$", JPY: "¥", CHF: "CHF " };
const NO_DECIMALS = new Set(["JPY"]);

/** Formats an amount in minor units: money(250, "EUR") → "€2.50". */
export function money(minor: number, currency = "EUR"): string {
  const code = currency.toUpperCase();
  const symbol = SYMBOLS[code] ?? `${code} `;
  const negative = minor < 0;
  const abs = Math.abs(Math.round(minor));
  const body = NO_DECIMALS.has(code)
    ? groupThousands(String(abs))
    : `${groupThousands(String(Math.floor(abs / 100)))}.${String(abs % 100).padStart(2, "0")}`;
  return `${negative ? "-" : ""}${symbol}${body}`;
}

function groupThousands(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function plural(count: number, one: string, many = `${one}s`): string {
  return `${count} ${count === 1 ? one : many}`;
}

export function shortTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export function titleCase(value: string): string {
  return value.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
