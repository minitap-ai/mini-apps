import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { productById } from "@/lib/catalog";
import { euros, findPromo, FREE_DELIVERY_FROM_CENTS, unitPriceCents } from "@/lib/pricing";
import { useUser } from "@/state/app";
import { useCart } from "@/state/cart";
import { Body, Button, Card, Field, Heading, Row, Screen, Stepper, Title } from "@/ui/kit";
import { TotalsCard } from "@/ui/totals";
import { ProductImage } from "@/ui/late";
import { colors, space, type } from "@/ui/theme";

export default function CartScreen() {
  const cart = useCart();
  const { account } = useUser();
  const [code, setCode] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);
  const today = new Date();

  if (cart.lines.length === 0) {
    return (
      <Screen testID="cart-screen">
        <Title>Your cart is empty</Title>
        <Body>Add products from Home or Search.</Body>
        <Button label="Start shopping" testID="cart-start-shopping" onPress={() => router.navigate("/")} />
      </Screen>
    );
  }

  const apply = () => {
    const promo = findPromo(code);
    if (!promo) return setPromoError("This code is not valid.");
    if (cart.totals.subtotalCents < promo.minSubtotalCents) return setPromoError(`This code needs a subtotal of at least ${euros(promo.minSubtotalCents)}.`);
    setPromoError(null);
    setCode("");
    cart.applyPromo(promo.code);
  };

  return (
    <Screen testID="cart-screen">
      <Title>Your cart</Title>
      {cart.lines.map((line) => {
        const product = productById(line.productId);
        const variant = product?.variants.find((v) => v.id === line.variantId);
        if (!product || !variant) return null;
        return (
          <Card key={line.variantId} testID={`cart-line-${line.variantId}`} style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
            <ProductImage product={product} size={56} testID={`cart-image-${line.variantId}`} />
            <View style={{ flex: 1 }}>
              <Text style={type.bodyStrong}>{product.name}</Text>
              <Text style={type.small}>{variant.label}</Text>
              <Text style={type.price} testID={`cart-line-total-${line.variantId}`}>{euros(unitPriceCents(product, variant, today) * line.qty)}</Text>
            </View>
            <Stepper value={line.qty} onChange={(qty) => cart.setQty(line, qty)} testID={`cart-qty-${line.variantId}`} />
          </Card>
        );
      })}
      <Heading>Promo code</Heading>
      {cart.promo ? (
        <Row>
          <Body strong testID="promo-applied">{`${cart.promo.code}: ${cart.promo.label}`}</Body>
          <Button label="Remove" testID="promo-remove" kind="ghost" onPress={() => cart.applyPromo(null)} />
        </Row>
      ) : (
        <>
          <Field label="Code" testID="promo-input" value={code} onChangeText={setCode} autoCapitalize="characters" autoCorrect={false} placeholder="WELCOME10" />
          {promoError ? <Text style={[type.bodyStrong, { color: colors.danger }]} testID="promo-error">{promoError}</Text> : null}
          <Button label="Apply" testID="promo-apply" kind="secondary" disabled={!code.trim()} onPress={apply} />
        </>
      )}
      <TotalsCard totals={cart.totals} />
      {cart.totals.subtotalCents < FREE_DELIVERY_FROM_CENTS ? (
        <Body soft testID="free-delivery-hint">{`Add ${euros(FREE_DELIVERY_FROM_CENTS - cart.totals.subtotalCents)} more for free delivery.`}</Body>
      ) : null}
      <Button label={account ? "Checkout" : "Sign in to check out"} testID="cart-checkout" onPress={() => router.push(account ? "/checkout" : "/sign-in?next=checkout")} />
    </Screen>
  );
}
