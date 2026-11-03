import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { api } from "@/lib/backend";
import { useLoad } from "@/state/use-load";
import { Button, Card, ErrorState, Loading, Screen, Title } from "@/ui/kit";
import { AmountRow, Lines } from "@/ui/lines";
import { colors, type } from "@/ui/theme";

export default function OrderTrackingScreen() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const order = useLoad(() => api.order(id), [id]);
  const status = useLoad(() => api.orderStatus(id), [id]);
  const o = order.data?.order;

  return (
    <Screen testID="order-screen">
      <Title testID="order-title">{o ? `Order ${o.number}` : "Your order"}</Title>
      <Card testID="order-status-card">
        {status.loading ? (
          <Loading label="Checking status…" testID="order-status-loading" />
        ) : status.error ? (
          <ErrorState message={status.error.message} onRetry={status.reload} testID="order-status-error" />
        ) : status.data ? (
          <Text style={[type.display, { color: colors.success }]} testID="order-status">
            {status.data.label}
          </Text>
        ) : null}
      </Card>
      {!status.loading ? <Button label="Refresh status" kind="secondary" testID="order-status-refresh" onPress={status.reload} /> : null}
      {order.error ? <ErrorState message={order.error.message} onRetry={order.reload} testID="order-error" /> : null}
      {order.loading ? <Loading testID="order-loading" /> : null}
      {o ? (
        <Card testID="order-details">
          <Lines lines={o.lines} currency={o.currency} testID="order-lines" />
          <AmountRow label="Subtotal" amount={o.subtotal} currency={o.currency} testID="order-subtotal" />
          {o.fulfilment === "delivery" ? (
            <AmountRow label="Delivery fee" amount={o.deliveryFee} currency={o.currency} testID="order-delivery-fee" />
          ) : null}
          <AmountRow label="Total" amount={o.total} currency={o.currency} testID="order-total" strong />
        </Card>
      ) : null}
    </Screen>
  );
}
