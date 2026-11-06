import { router } from "expo-router";
import { useEffect, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { happens, shuffled } from "@/lib/chaos";
import { CATEGORIES, PRODUCTS, RECOMMENDED_IDS, productById, type Product } from "@/lib/catalog";
import { askForNotifications } from "@/lib/permissions";
import { saleProductId } from "@/lib/pricing";
import { useApp, useUser } from "@/state/app";
import { nextInterruption } from "@/ui/interruptions";
import { Heading, Screen } from "@/ui/kit";
import { ProductCard } from "@/ui/product-card";
import { ConsentSheet, WhatsNewSheet } from "@/ui/sheets";
import { colors, radius, space, type } from "@/ui/theme";

const BANNERS = {
  a: { title: "Free delivery from €35", subtitle: "On every order, every day" },
  b: { title: "10% off your first order", subtitle: "Use the code WELCOME10 at checkout" },
};

export default function Home() {
  const { data, chaos, update } = useApp();
  const { name } = useUser();
  const interruption = nextInterruption(data, chaos);
  const banner = happens(chaos, "bannerVariantB") ? BANNERS.b : BANNERS.a;
  const deal = productById(saleProductId(new Date())) as Product;
  const recommended = useMemo(
    () => shuffled(chaos, RECOMMENDED_IDS.map((id) => PRODUCTS.find((p) => p.id === id) as Product), data.launches),
    [chaos, data.launches],
  );

  useEffect(() => {
    if (interruption !== "notifications") return;
    askForNotifications()
      .catch(() => false)
      .finally(() => update((d) => ({ ...d, notificationsAsked: true })));
  }, [interruption, update]);

  return (
    <Screen testID="home-screen">
      <Text style={type.title} testID="home-greeting">
        {name ? `Hello ${name.split(" ")[0]}` : "Hello"}
      </Text>
      <View style={styles.banner} testID="promo-banner">
        <Text style={[type.heading, { color: "#fff" }]}>{banner.title}</Text>
        <Text style={[type.body, { color: "#E8F5EC" }]}>{banner.subtitle}</Text>
      </View>
      <Heading>Shop by category</Heading>
      <View style={styles.grid}>
        {CATEGORIES.map((c) => (
          <Pressable
            key={c.id}
            testID={`category-${c.id}`}
            accessibilityRole="button"
            accessibilityLabel={c.name}
            onPress={() => router.push(`/category/${c.id}`)}
            style={({ pressed }) => [styles.tile, pressed && { opacity: 0.8 }]}
          >
            <Text style={{ fontSize: 34 }}>{c.emoji}</Text>
            <Text style={[type.bodyStrong, { textAlign: "center" }]}>{c.name}</Text>
          </Pressable>
        ))}
      </View>
      <Heading testID="deal-heading">Deal of the day</Heading>
      <ProductCard product={deal} />
      <Heading>Recommended for you</Heading>
      <View style={{ gap: space.sm }} testID="recommended-list">
        {recommended.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </View>
      {interruption === "consent" ? (
        <ConsentSheet onDone={(consent) => update((d) => ({ ...d, consent, consentAskedAt: d.launches }))} />
      ) : null}
      {interruption === "whats-new" ? <WhatsNewSheet onClose={() => update((d) => ({ ...d, whatsNewSeenAt: d.launches }))} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  banner: { backgroundColor: colors.accent, borderRadius: radius.lg, padding: space.xl, gap: space.xs },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: space.sm },
  tile: { width: "31%", flexGrow: 1, alignItems: "center", gap: space.xs, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, paddingVertical: space.md, paddingHorizontal: space.sm },
});
