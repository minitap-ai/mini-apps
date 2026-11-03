import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { api, type Tile } from "@/lib/backend";
import { useLoad } from "@/state/use-load";
import { Interruptions } from "@/ui/interruptions";
import { ErrorState, Heading, LinkRow, Loading, Screen } from "@/ui/kit";
import { colors, radius, space, type } from "@/ui/theme";

const TILES: Record<Tile, { label: string; hint: string; go: () => void }> = {
  menu: { label: "Menu", hint: "Breads, pastries and drinks", go: () => router.push("/menu") },
  search: { label: "Search", hint: "Find something you like", go: () => router.push("/menu?search=1") },
  daily: { label: "Croissant of the day", hint: "Today's special", go: () => router.push("/daily") },
};

const MORE: { label: string; path: string; id: string }[] = [
  { label: "My orders", path: "/orders", id: "orders" },
  { label: "Loyalty", path: "/loyalty", id: "loyalty" },
  { label: "Family order", path: "/family", id: "family" },
  { label: "Custom cake", path: "/cake", id: "cake" },
  { label: "Opening hours", path: "/hours", id: "hours" },
  { label: "Our menu in your country", path: "/country", id: "country" },
  { label: "Allergens & legal", path: "/allergens", id: "allergens" },
  { label: "Kitchen board", path: "/kitchen", id: "kitchen" },
];

export default function HomeScreen() {
  const home = useLoad(() => api.home());

  return (
    <Screen testID="home-screen">
      {home.loading ? <Loading label="Warming up the oven…" testID="home-loading" /> : null}
      {home.error ? <ErrorState message={home.error.message} onRetry={home.reload} testID="home-error" /> : null}
      {home.data ? (
        <>
          <View style={styles.banner} testID="promo-banner">
            <Text style={[type.display, { color: "#fff" }]} testID="promo-banner-title">
              {home.data.banner.title}
            </Text>
            {home.data.banner.subtitle ? <Text style={[type.body, { color: "#FFF3E2" }]}>{home.data.banner.subtitle}</Text> : null}
          </View>
          <View style={{ gap: space.sm }} testID="entry-tiles">
            {home.data.tiles.map((tile) => {
              const entry = TILES[tile];
              if (!entry) return null;
              return <LinkRow key={tile} label={entry.label} hint={entry.hint} onPress={entry.go} testID={`tile-${tile}`} />;
            })}
          </View>
          <Heading>More from the bakery</Heading>
          <View style={{ gap: space.sm }}>
            {MORE.map((item) => (
              <LinkRow key={item.id} label={item.label} onPress={() => router.push(item.path as never)} testID={`link-${item.id}`} />
            ))}
          </View>
          <Interruptions items={home.data.interruptions} />
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  banner: { backgroundColor: colors.accent, borderRadius: radius.lg, padding: space.xl, gap: space.sm },
});
