import { useState } from "react";
import { View } from "react-native";
import { search } from "@/lib/catalog";
import { saleProductId } from "@/lib/pricing";
import { Body, Chip, Field, Row, Screen } from "@/ui/kit";
import { ProductCard } from "@/ui/product-card";
import { space } from "@/ui/theme";

export default function Search() {
  const [query, setQuery] = useState("");
  const [organic, setOrganic] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const results = search(query, { organic, onSale: onSale ? saleProductId(new Date()) : null });
  return (
    <Screen testID="search-screen">
      <Field label="Search products" testID="search-input" value={query} onChangeText={setQuery} placeholder="Milk, apples, coffee…" autoCapitalize="none" autoCorrect={false} returnKeyType="search" />
      <Row>
        <Chip label="Organic" selected={organic} onPress={() => setOrganic(!organic)} testID="filter-organic" />
        <Chip label="Deal of the day" selected={onSale} onPress={() => setOnSale(!onSale)} testID="filter-deal" />
      </Row>
      <Body soft testID="search-count">{`${results.length} ${results.length === 1 ? "product" : "products"}`}</Body>
      <View style={{ gap: space.sm }} testID="search-results">
        {results.length === 0 ? <Body testID="search-empty">No products match your search.</Body> : results.map((p) => <ProductCard key={p.id} product={p} />)}
      </View>
    </Screen>
  );
}
