import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppStateProvider } from "@/state/app";
import { colors } from "@/ui/theme";
import { ToastProvider } from "@/ui/toast";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <ToastProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: colors.surfaceWarm },
              headerTintColor: colors.accentDark,
              headerShadowVisible: false,
              headerBackButtonDisplayMode: "minimal",
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false, title: "Pantry" }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="sign-in" options={{ title: "Sign in", presentation: "modal" }} />
            <Stack.Screen name="checkout" options={{ title: "Checkout" }} />
            <Stack.Screen name="profile" options={{ title: "Edit profile" }} />
            <Stack.Screen name="notifications" options={{ title: "Notifications" }} />
            <Stack.Screen name="product/[id]" options={{ title: "" }} />
            <Stack.Screen name="category/[id]" options={{ title: "" }} />
            <Stack.Screen name="order/[id]" options={{ title: "Order" }} />
          </Stack>
        </ToastProvider>
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
