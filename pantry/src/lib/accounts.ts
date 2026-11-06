export interface Account {
  email: string;
  password: string;
  name: string;
  /** Accounts with two-step sign-in ask for this code after the password. */
  code?: string;
}

/** Fixed test accounts: the app has no server, so they live here and in the Minitest personas. */
export const ACCOUNTS: Account[] = [
  { email: "ana@pantry.test", password: "pantry-ana-1", name: "Ana Lopez" },
  { email: "ben@pantry.test", password: "pantry-ben-1", name: "Ben Carter", code: "000000" },
];

export type SignInResult = { ok: true; account: Account; needsCode: boolean } | { ok: false; error: string };

export function checkPassword(email: string, password: string): SignInResult {
  const account = ACCOUNTS.find((a) => a.email === email.trim().toLowerCase());
  if (!account || account.password !== password) return { ok: false, error: "Wrong email or password." };
  return { ok: true, account, needsCode: Boolean(account.code) };
}

export function checkCode(account: Account, code: string): boolean {
  return !account.code || account.code === code.trim();
}
