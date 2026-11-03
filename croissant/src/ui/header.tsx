import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useCart } from "@/state/cart";
import { useSession } from "@/state/session";
import { colors, radius, space } from "./theme";

export function HeaderTitle() {
  return (
    <Pressable testID="header-home" accessibilityRole="link" accessibilityLabel="Croissant, go to home" onPress={() => router.navigate("/")}>
      <Text style={styles.title}>🥐 Croissant</Text>
    </Pressable>
  );
}

export function HeaderActions() {
  const { cart } = useCart();
  const { user } = useSession();
  const count = cart?.count ?? 0;
  return (
    <View style={styles.actions}>
      <Pressable
        testID="header-cart"
        accessibilityRole="button"
        accessibilityLabel={count > 0 ? `Cart, ${count} items` : "Cart"}
        onPress={() => router.navigate("/cart")}
        style={styles.pill}
      >
        <Text style={styles.pillText}>{count > 0 ? `Cart (${count})` : "Cart"}</Text>
      </Pressable>
      <Pressable
        testID="header-account"
        accessibilityRole="button"
        accessibilityLabel={user ? "Account" : "Sign in"}
        onPress={() => router.navigate("/sign-in")}
        style={[styles.pill, styles.accountPill]}
      >
        <Text style={[styles.pillText, { color: "#fff" }]}>{user ? "Account" : "Sign in"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "800", color: colors.ink },
  actions: { flexDirection: "row", gap: space.sm, paddingRight: space.sm },
  pill: {
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.accent,
    paddingHorizontal: space.md,
    paddingVertical: 6,
    backgroundColor: colors.surface,
  },
  accountPill: { backgroundColor: colors.accent },
  pillText: { fontSize: 15, fontWeight: "800", color: colors.accentDark },
});
