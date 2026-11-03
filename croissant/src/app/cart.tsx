import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Text, View } from "react-native";
import { api, type CartLine } from "@/lib/backend";
import { money } from "@/lib/format";
import { useCart } from "@/state/cart";
import { asApiError } from "@/state/use-load";
import { Body, Button, Card, ErrorState, Loading, Row, Screen, Title } from "@/ui/kit";
import { AmountRow } from "@/ui/lines";
import { space, type } from "@/ui/theme";
import { useToast } from "@/ui/toast";

export default function CartScreen() {
  const { cart, setCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const toast = useToast();
  // Only the latest request may update the cart; older responses are dropped.
  const latest = useRef(0);

  const load = useCallback(() => {
    const seq = ++latest.current;
    setLoading(true);
    setError(null);
    api
      .cart()
      .then((r) => {
        if (seq === latest.current) setCart(r.cart);
      })
      .catch((err: unknown) => {
        if (seq === latest.current) setError(asApiError(err).message);
      })
      .finally(() => {
        if (seq === latest.current) setLoading(false);
      });
  }, [setCart]);

  useFocusEffect(
    useCallback(() => {
      load();
      return () => {
        latest.current++;
      };
    }, [load]),
  );

  const change = (productId: string, qty: number) => {
    const seq = ++latest.current;
    setUpdating(true);
    api
      .setQuantity(productId, qty)
      .then((r) => {
        if (seq === latest.current) setCart(r.cart);
      })
      .catch((err: unknown) => toast(asApiError(err).message, 3000))
      .finally(() => setUpdating(false));
  };

  return (
    <Screen testID="cart-screen">
      <Title>Your cart</Title>
      {loading && !cart ? <Loading label="Loading your cart…" testID="cart-loading" /> : null}
      {error ? <ErrorState message={error} onRetry={load} testID="cart-error" /> : null}
      {cart && cart.lines.length === 0 ? (
        <Card testID="cart-empty">
          <Body strong>Your cart is empty.</Body>
          <Button label="Browse the menu" testID="cart-browse" onPress={() => router.push("/menu")} />
        </Card>
      ) : null}
      {cart && cart.lines.length > 0 ? (
        <>
          {cart.lines.map((line) => (
            <CartRow
              key={line.productId}
              line={line}
              currency={cart.currency}
              busy={updating}
              onChange={(qty) => change(line.productId, qty)}
            />
          ))}
          <Card>
            <AmountRow label="Subtotal" amount={cart.subtotal} currency={cart.currency} testID="cart-subtotal" strong />
          </Card>
          <Button label="Checkout" testID="cart-checkout" onPress={() => router.push("/checkout")} />
        </>
      ) : null}
    </Screen>
  );
}

function CartRow({ line, currency, busy, onChange }: { line: CartLine; currency: string; busy: boolean; onChange: (qty: number) => void }) {
  const change = onChange;
  return (
    <Card testID={`cart-line-${line.productId}`}>
      <Row style={{ justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          <Text style={type.bodyStrong}>{line.name}</Text>
          <Text style={type.small}>{money(line.unitPrice, currency)} each</Text>
        </View>
        <Text style={type.bodyStrong} testID={`cart-line-total-${line.productId}`}>
          {money(line.lineTotal, currency)}
        </Text>
      </Row>
      <Row style={{ gap: space.sm }}>
        <Button
          label="−"
          kind="secondary"
          testID={`cart-decrease-${line.productId}`}
          onPress={() => change(line.qty - 1)}
          disabled={busy}
        />
        <Text style={[type.heading, { minWidth: 32, textAlign: "center" }]} testID={`cart-qty-${line.productId}`}>
          {line.qty}
        </Text>
        <Button
          label="+"
          kind="secondary"
          testID={`cart-increase-${line.productId}`}
          onPress={() => change(line.qty + 1)}
          disabled={busy}
        />
        <Button label="Remove" kind="ghost" testID={`cart-remove-${line.productId}`} onPress={() => change(0)} disabled={busy} />
      </Row>
    </Card>
  );
}
