import { router, useFocusEffect } from "expo-router";
import { api } from "@/lib/backend";
import { money, shortTime } from "@/lib/format";
import { useLoad } from "@/state/use-load";
import { Body, Button, Card, ErrorState, LinkRow, Loading, Screen, Title } from "@/ui/kit";

export default function OrdersScreen() {
  const orders = useLoad(() => api.orders());
  useFocusEffect(orders.reload);
  const list = orders.data?.orders ?? [];

  return (
    <Screen testID="orders-screen">
      <Title>My orders</Title>
      {orders.loading && !orders.data ? <Loading label="Loading your orders…" testID="orders-loading" /> : null}
      {orders.error ? <ErrorState message={orders.error.message} onRetry={orders.reload} testID="orders-error" /> : null}
      {orders.data && list.length === 0 ? (
        <Card testID="orders-empty">
          <Body strong>No orders yet.</Body>
          <Button label="Browse the menu" testID="orders-browse" onPress={() => router.push("/menu")} />
        </Card>
      ) : null}
      {list.map((order) => (
        <LinkRow
          key={order.id}
          label={`${order.number} · ${money(order.total, order.currency)}`}
          hint={`${order.statusLabel} · ${shortTime(order.createdAt)}`}
          onPress={() => router.push(`/orders/${order.id}`)}
          testID={`order-${order.number}`}
        />
      ))}
    </Screen>
  );
}
