import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CartProvider } from "@/state/cart";
import { SessionProvider } from "@/state/session";
import { HeaderActions, HeaderTitle } from "@/ui/header";
import { colors } from "@/ui/theme";
import { ToastProvider } from "@/ui/toast";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SessionProvider>
        <ToastProvider>
          <CartProvider>
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerTitle: () => <HeaderTitle />,
                headerRight: () => <HeaderActions />,
                headerStyle: { backgroundColor: colors.surfaceWarm },
                headerTintColor: colors.accentDark,
                headerShadowVisible: false,
                headerBackButtonDisplayMode: "minimal",
                title: "Croissant",
                contentStyle: { backgroundColor: colors.background },
              }}
            />
          </CartProvider>
        </ToastProvider>
      </SessionProvider>
    </SafeAreaProvider>
  );
}
