import { Stack, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { productById } from "@/lib/catalog";
import { saleProductId } from "@/lib/pricing";
import { useCart } from "@/state/cart";
import { Body, Button, Chip, Heading, Row, Screen, Stepper, Title } from "@/ui/kit";
import { Price, ProductImage } from "@/ui/late";
import { useAddLabel } from "@/ui/product-card";
import { space } from "@/ui/theme";
import { useToast } from "@/ui/toast";

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = productById(id ?? "");
  const cart = useCart();
  const toast = useToast();
  const label = useAddLabel();
  const [variantId, setVariantId] = useState(product?.variants[0]?.id);
  const [qty, setQty] = useState(1);
  if (!product) {
    return (
      <Screen testID="product-missing">
        <Body>This product is no longer available.</Body>
      </Screen>
    );
  }
  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0]!;
  return (
    <Screen testID="product-screen">
      <Stack.Screen options={{ title: product.name }} />
      <View style={{ alignItems: "center" }}>
        <ProductImage product={product} size={180} testID="product-image" />
      </View>
      <Title testID="product-name">{product.name}</Title>
      {saleProductId(new Date()) === product.id ? <Body strong testID="product-deal">Deal of the day: 20% off</Body> : null}
      <Price product={product} variant={variant} testID="product-price" />
      <Body soft>{product.organic ? `Organic · ${product.description}` : product.description}</Body>
      {product.variants.length > 1 ? (
        <>
          <Heading>Size</Heading>
          <Row style={{ flexWrap: "wrap" }}>
            {product.variants.map((v) => (
              <Chip key={v.id} label={v.label} selected={v.id === variant.id} onPress={() => setVariantId(v.id)} testID={`variant-${v.id}`} />
            ))}
          </Row>
        </>
      ) : (
        <Body testID="product-size">{variant.label}</Body>
      )}
      <Heading>Quantity</Heading>
      <Stepper value={qty} onChange={setQty} min={1} testID="product-qty" />
      <Button
        label={label}
        testID="product-add"
        style={{ marginTop: space.md }}
        onPress={() => {
          cart.add(product.id, variant.id, qty);
          toast(`${qty} × ${product.name} added`);
        }}
      />
      <Button label="View cart" testID="product-view-cart" kind="secondary" onPress={() => router.navigate("/cart")} />
    </Screen>
  );
}
