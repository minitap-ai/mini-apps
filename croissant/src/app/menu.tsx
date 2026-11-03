import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { api, type MenuProduct, type Prices } from "@/lib/backend";
import { money } from "@/lib/format";
import { useLoad } from "@/state/use-load";
import { AddButton } from "@/ui/add-button";
import { Body, Chip, ErrorState, Field, Heading, Loading, ProductPhoto, Row, Screen, Skeleton, Title } from "@/ui/kit";
import { colors, radius, space, type } from "@/ui/theme";

const FILTERS = [
  { tag: "gluten-free", label: "Gluten-free" },
  { tag: "vegan", label: "Vegan" },
];

export default function MenuScreen() {
  const params = useLocalSearchParams<{ search?: string }>();
  const menu = useLoad(() => api.menu());
  const prices = useLoad(() => api.prices());
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<string[]>([]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (menu.data?.products ?? []).filter(
      (p) =>
        filters.every((tag) => p.tags.includes(tag)) &&
        (!term || p.name.toLowerCase().includes(term) || (p.description ?? "").toLowerCase().includes(term)),
    );
  }, [menu.data, search, filters]);

  const toggle = (tag: string) => setFilters((current) => (current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag]));

  return (
    <Screen testID="menu-screen">
      <Title>Menu</Title>
      <Field
        label="Search the menu"
        placeholder="Search the menu"
        testID="menu-search"
        value={search}
        onChangeText={setSearch}
        autoFocus={params.search === "1"}
        autoCorrect={false}
        returnKeyType="search"
      />
      <Row style={{ flexWrap: "wrap" }}>
        {FILTERS.map((f) => (
          <Chip key={f.tag} label={f.label} selected={filters.includes(f.tag)} onPress={() => toggle(f.tag)} testID={`filter-${f.tag}`} />
        ))}
      </Row>
      {menu.loading ? <Loading label="Loading the menu…" testID="menu-loading" /> : null}
      {menu.error ? <ErrorState message={menu.error.message} onRetry={menu.reload} testID="menu-error" /> : null}
      {prices.error ? <ErrorState message="We couldn't load prices." onRetry={prices.reload} testID="prices-error" /> : null}
      {menu.data
        ? menu.data.categories.map((category) => {
            const products = visible.filter((p) => p.categoryId === category.id);
            if (products.length === 0) return null;
            return (
              <View key={category.id} style={{ gap: space.sm }} testID={`category-${category.id}`}>
                <Heading>{category.name}</Heading>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} prices={prices.data} />
                ))}
              </View>
            );
          })
        : null}
      {menu.data && visible.length === 0 ? (
        <Body testID="menu-empty">Nothing matches. Try another search or filter.</Body>
      ) : null}
    </Screen>
  );
}

function ProductCard({ product, prices }: { product: MenuProduct; prices: Prices | null }) {
  const price = prices?.prices[product.id];
  return (
    <View style={styles.card} testID={`product-card-${product.id}`}>
      <Pressable
        style={styles.cardMain}
        onPress={() => router.push(`/product/${product.id}`)}
        accessibilityRole="link"
        accessibilityLabel={product.name}
        testID={`product-open-${product.id}`}
      >
        <ProductPhoto image={product.image} size={72} label={product.name} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={type.bodyStrong}>{product.name}</Text>
          {product.tags.length > 0 ? (
            <Text style={type.small}>{product.tags.map((t) => FILTERS.find((f) => f.tag === t)?.label ?? t).join(" · ")}</Text>
          ) : null}
          {price === undefined ? (
            <Skeleton width={64} height={22} testID={`product-price-loading-${product.id}`} />
          ) : (
            <Text style={type.price} testID={`product-price-${product.id}`}>
              {money(price, prices?.currency)}
            </Text>
          )}
        </View>
      </Pressable>
      <AddButton productId={product.id} testID={`add-${product.id}`} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.md,
  },
  cardMain: { flex: 1, flexDirection: "row", alignItems: "center", gap: space.md },
});
