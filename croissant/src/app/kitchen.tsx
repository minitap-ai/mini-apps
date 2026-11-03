import { Text, View } from "react-native";
import { api } from "@/lib/backend";
import { useLoad } from "@/state/use-load";
import { Body, Button, Card, ErrorState, Heading, Loading, Screen, Title } from "@/ui/kit";
import { space, type } from "@/ui/theme";

export default function KitchenScreen() {
  const board = useLoad(() => api.board());
  return (
    <Screen testID="kitchen-screen">
      <Title>Kitchen board</Title>
      <Body soft>Today's orders by status.</Body>
      {board.loading ? <Loading testID="kitchen-loading" /> : null}
      {board.error ? <ErrorState message={board.error.message} onRetry={board.reload} testID="kitchen-error" /> : null}
      {board.data?.columns.map((column) => (
        <View key={column.status} style={{ gap: space.sm }} testID={`kitchen-column-${column.status}`}>
          <Heading>
            {column.label} ({column.orders.length})
          </Heading>
          {column.orders.length === 0 ? <Body soft>Nothing here.</Body> : null}
          {column.orders.map((order) => (
            <Card key={order.number} testID={`kitchen-order-${order.number}`}>
              <Text style={type.bodyStrong}>{order.number}</Text>
              <Body>{order.items}</Body>
              <Body soft>{order.fulfilment === "delivery" ? "Delivery" : "Pickup"}</Body>
            </Card>
          ))}
        </View>
      ))}
      {board.data ? <Button label="Refresh" kind="secondary" testID="kitchen-refresh" onPress={board.reload} /> : null}
    </Screen>
  );
}
