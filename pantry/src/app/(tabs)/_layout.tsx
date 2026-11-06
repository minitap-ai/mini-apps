import { Redirect, Tabs } from "expo-router";
import { Text } from "react-native";
import { useApp } from "@/state/app";
import { useCart } from "@/state/cart";
import { Loading } from "@/ui/kit";
import { colors } from "@/ui/theme";

const icon = (emoji: string) => () => <Text style={{ fontSize: 22 }}>{emoji}</Text>;

export default function TabsLayout() {
  const { ready, data } = useApp();
  const cart = useCart();
  if (!ready) return <Loading label="Opening Pantry…" testID="app-loading" />;
  if (!data.onboardingDone) return <Redirect href="/onboarding" />;
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.surfaceWarm },
        headerTintColor: colors.accentDark,
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.accentDark,
        tabBarInactiveTintColor: colors.inkSoft,
        tabBarLabelStyle: { fontSize: 12, fontWeight: "700" },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", headerTitle: "Pantry", tabBarIcon: icon("🏠"), tabBarButtonTestID: "tab-home" }} />
      <Tabs.Screen name="search" options={{ title: "Search", tabBarIcon: icon("🔍"), tabBarButtonTestID: "tab-search" }} />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: icon("🛒"),
          tabBarButtonTestID: "tab-cart",
          tabBarBadge: cart.totals.itemCount > 0 ? cart.totals.itemCount : undefined,
        }}
      />
      <Tabs.Screen name="orders" options={{ title: "Orders", tabBarIcon: icon("📦"), tabBarButtonTestID: "tab-orders" }} />
      <Tabs.Screen name="account" options={{ title: "Account", tabBarIcon: icon("👤"), tabBarButtonTestID: "tab-account" }} />
    </Tabs>
  );
}
