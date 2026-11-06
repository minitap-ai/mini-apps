import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { categoryById, PRODUCTS, type Product } from "@/lib/catalog";
import { unitPriceCents } from "@/lib/pricing";
import { Body, Chip, Row, Screen } from "@/ui/kit";
import { ProductCard } from "@/ui/product-card";
import { space } from "@/ui/theme";

type Sort = "popular" | "price";

const cheapest = (p: Product, day: Date) => Math.min(...p.variants.map((v) => unitPriceCents(p, v, day)));

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const category = categoryById(id ?? "");
  const [organic, setOrganic] = useState(false);
  const [sort, setSort] = useState<Sort>("popular");
  const today = new Date();
  let products = PRODUCTS.filter((p) => p.categoryId === id && (!organic || p.organic));
  if (sort === "price") products = [...products].sort((a, b) => cheapest(a, today) - cheapest(b, today));
  return (
    <Screen testID="category-screen">
      <Stack.Screen options={{ title: category?.name ?? "Category" }} />
      {!category ? <Body>This category does not exist.</Body> : null}
      <Row>
        <Chip label="Organic" selected={organic} onPress={() => setOrganic(!organic)} testID="filter-organic" />
        <Chip label="Lowest price" selected={sort === "price"} onPress={() => setSort(sort === "price" ? "popular" : "price")} testID="sort-price" />
      </Row>
      <Body soft testID="category-count">{`${products.length} ${products.length === 1 ? "product" : "products"}`}</Body>
      <View style={{ gap: space.sm }} testID="category-products">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </View>
    </Screen>
  );
}
