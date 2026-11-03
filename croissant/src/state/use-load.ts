import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/backend";

export interface Loaded<T> {
  data: T | null;
  error: ApiError | null;
  loading: boolean;
  reload: () => void;
  setData: (value: T) => void;
}

/** Runs `load` on mount (and whenever `deps` change) and tracks its state. */
export function useLoad<T>(load: () => Promise<T>, deps: unknown[] = []): Loaded<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const latest = useRef(load);
  latest.current = load;

  useEffect(() => {
    let live = true;
    setLoading(true);
    setError(null);
    latest
      .current()
      .then((value) => {
        if (live) setData(value);
      })
      .catch((err: unknown) => {
        if (live) setError(asApiError(err));
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, ...deps]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  return { data, error, loading, reload, setData };
}

export function asApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;
  const message = err instanceof Error && err.message ? err.message : "Something went wrong. Please try again.";
  return new ApiError(0, "CLIENT", message);
}
