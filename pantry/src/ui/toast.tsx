import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, space } from "./theme";

const DEFAULT_MS = 2000;

const ToastContext = createContext<(message: string, ms?: number) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((text: string, ms = DEFAULT_MS) => {
    if (timer.current) clearTimeout(timer.current);
    setMessage(text);
    timer.current = setTimeout(() => setMessage(null), ms);
  }, []);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {message ? (
        <View pointerEvents="none" style={styles.wrap}>
          <View style={styles.toast} testID="toast" accessibilityLiveRegion="polite" accessibilityRole="alert">
            <Text style={styles.text}>{message}</Text>
          </View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
  wrap: { position: "absolute", left: 0, right: 0, bottom: 48, alignItems: "center" },
  toast: { backgroundColor: colors.ink, borderRadius: radius.pill, paddingVertical: space.md, paddingHorizontal: space.xxl },
  text: { color: "#fff", fontSize: 20, fontWeight: "800" },
});
