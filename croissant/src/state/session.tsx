import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { auth, type User } from "@/lib/backend";

interface Session {
  user: User | null;
  ready: boolean;
  refresh: () => Promise<void>;
  signIn: (userId: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<Session>({
  user: null,
  ready: false,
  refresh: async () => {},
  signIn: async () => {},
  signOut: async () => {},
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    setUser(await auth.current());
    setReady(true);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const signIn = useCallback(async (userId: string, code: string) => {
    setUser(await auth.signIn(userId, code));
  }, []);

  const signOut = useCallback(async () => {
    await auth.signOut();
    setUser(null);
  }, []);

  return <SessionContext.Provider value={{ user, ready, refresh, signIn, signOut }}>{children}</SessionContext.Provider>;
}

export const useSession = () => useContext(SessionContext);
