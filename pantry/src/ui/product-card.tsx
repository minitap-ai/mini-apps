import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { happens } from "@/lib/chaos";
import type { Product } from "@/lib/catalog";
import { saleProductId } from "@/lib/pricing";
import { useApp } from "@/state/app";
import { useCart } from "@/state/cart";
import { Button } from "./kit";
import { Price, ProductImage } from "./late";
import { colors, radius, space, type } from "./theme";
import { useToast } from "./toast";

/** The add button's wording is an A/B test, drawn once per install. */
export function useAddLabel(): string {
  const { chaos } = useApp();
  return happens(chaos, "addLabelVariantB") ? "Add to basket" : "Add to cart";
}

export function ProductCard({ product }: { product: Product }) {
  const cart = useCart();
  const toast = useToast();
  const label = useAddLabel();
  const variant = product.variants[0];
  if (!variant) return null;
  const onSale = saleProductId(new Date()) === product.id;
  return (
    <Pressable
      testID={`product-card-${product.id}`}
      accessibilityRole="button"
      accessibilityLabel={product.name}
      onPress={() => router.push(`/product/${product.id}`)}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
    >
      <ProductImage product={product} testID={`product-image-${product.id}`} />
      <View style={{ flex: 1, gap: space.xs }}>
        <Text style={type.bodyStrong}>{product.name}</Text>
        <Text style={type.small}>
          {variant.label}
          {product.organic ? " · Organic" : ""}
        </Text>
        {onSale ? <Text style={styles.sale} testID={`sale-badge-${product.id}`}>Deal of the day −20%</Text> : null}
        <Price product={product} variant={variant} testID={`price-${product.id}`} />
      </View>
      <Button
        label={label}
        testID={`add-${product.id}`}
        kind="secondary"
        style={{ paddingHorizontal: space.md, minHeight: 44 }}
        onPress={() => {
          cart.add(product.id, variant.id);
          toast(`${product.name} added`);
        }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", gap: space.md, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: space.md },
  sale: { alignSelf: "flex-start", backgroundColor: colors.saleSoft, color: colors.sale, fontWeight: "800", fontSize: 13, paddingHorizontal: space.sm, paddingVertical: 2, borderRadius: radius.pill, overflow: "hidden" },
});
