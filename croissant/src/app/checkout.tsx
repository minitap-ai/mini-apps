import { router } from "expo-router";
import { useState } from "react";
import { Text } from "react-native";
import { api, type Fulfilment, type Order } from "@/lib/backend";
import { money } from "@/lib/format";
import { useCart } from "@/state/cart";
import { asApiError, useLoad } from "@/state/use-load";
import { Body, Button, Card, Chip, ErrorState, Loading, Notice, Row, Screen, Title } from "@/ui/kit";
import { AmountRow, Lines } from "@/ui/lines";
import { type } from "@/ui/theme";

export default function CheckoutScreen() {
  const [fulfilment, setFulfilment] = useState<Fulfilment>("delivery");
  const quote = useLoad(() => api.quote(fulfilment), [fulfilment]);
  const { setCart } = useCart();
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const q = quote.data?.quote;

  if (order) {
    return (
      <Screen testID="checkout-screen">
        <Notice message="Order confirmed" testID="order-confirmed" />
        <Text style={type.title} testID="order-number">
          Order number {order.number}
        </Text>
        <Body testID="order-total">Total paid: {money(order.total, order.currency)}</Body>
        <Button label="Track my order" testID="order-track" onPress={() => router.replace(`/orders/${order.id}`)} />
        <Button label="Back to home" kind="secondary" testID="order-home" onPress={() => router.replace("/")} />
      </Screen>
    );
  }

  const place = () => {
    if (!q) return;
    setPlacing(true);
    setPlaceError(null);
    api
      .placeOrder(q.id)
      .then((r) => {
        setOrder(r.order);
        setCart({ lines: [], subtotal: 0, currency: r.order.currency, count: 0 });
      })
      .catch((err: unknown) => setPlaceError(asApiError(err).message))
      .finally(() => setPlacing(false));
  };

  return (
    <Screen testID="checkout-screen">
      <Title>Checkout</Title>
      <Row>
        <Chip label="Delivery" selected={fulfilment === "delivery"} onPress={() => setFulfilment("delivery")} testID="fulfilment-delivery" />
        <Chip label="Pickup" selected={fulfilment === "pickup"} onPress={() => setFulfilment("pickup")} testID="fulfilment-pickup" />
      </Row>
      {quote.loading ? <Loading label="Working out your total…" testID="checkout-loading" /> : null}
      {quote.error ? <ErrorState message={quote.error.message} onRetry={quote.reload} testID="checkout-error" /> : null}
      {q && !quote.loading ? (
        <>
          <Card testID="checkout-summary">
            <Lines lines={q.lines} currency={q.currency} testID="checkout-lines" />
            <AmountRow label="Subtotal" amount={q.subtotal} currency={q.currency} testID="checkout-subtotal" />
            {q.fulfilment === "delivery" ? (
              <Text style={type.body} testID="checkout-delivery-fee">
                Delivery fee {money(q.deliveryFee, q.currency)}
              </Text>
            ) : (
              <Text style={type.body} testID="checkout-pickup">
                Pickup at the bakery: free
              </Text>
            )}
            <AmountRow label="Total" amount={q.total} currency={q.currency} testID="checkout-total" strong />
          </Card>
          {placeError ? <ErrorState message={placeError} testID="checkout-place-error" /> : null}
          <Button label="Place order" testID="checkout-place-order" busy={placing} onPress={place} />
        </>
      ) : null}
    </Screen>
  );
}
