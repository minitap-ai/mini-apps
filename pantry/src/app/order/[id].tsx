import { Stack, router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { productById } from "@/lib/catalog";
import { STATUSES, statusAt } from "@/lib/orders";
import { useApp, useUser } from "@/state/app";
import { Body, Button, Card, Heading, Loading, Notice, Screen } from "@/ui/kit";
import { useLate } from "@/ui/late";
import { RatingDialog } from "@/ui/sheets";
import { colors, radius, space, type } from "@/ui/theme";
import { TotalsCard } from "@/ui/totals";

export default function OrderScreen() {
  const { id, placed } = useLocalSearchParams<{ id: string; placed?: string }>();
  const { data, update } = useApp();
  const { account, orders } = useUser();
  const order = orders.find((o) => o.id === id);
  const statusReady = useLate("orderStatus", id ?? "");
  if (!order || !account) {
    return (
      <Screen testID="order-missing">
        <Body>This order was not found.</Body>
      </Screen>
    );
  }
  const email = account.email;
  const status = statusAt(order, new Date());
  const reached = STATUSES.indexOf(status);
  const askRating = placed === "1" && orders.length >= 2 && !data.ratingAnswered[email];
  return (
    <Screen testID="order-screen">
      <Stack.Screen options={{ title: `Order ${order.number}` }} />
      {placed === "1" ? <Notice message={`Thank you! Order ${order.number} is confirmed.`} testID="order-confirmed" /> : null}
      <Heading>Status</Heading>
      {!statusReady ? (
        <Loading label="Checking status…" testID="order-status-loading" />
      ) : (
        <View testID="order-timeline" style={{ gap: space.sm }}>
          {STATUSES.map((s, i) => (
            <View key={s} style={styles.step} testID={`order-step-${i + 1}`}>
              <View style={[styles.dot, i <= reached && styles.dotDone]} />
              <Text style={i <= reached ? type.bodyStrong : type.small}>{s}</Text>
            </View>
          ))}
          <Text style={type.bodyStrong} testID="order-status">{`Status: ${status}`}</Text>
        </View>
      )}
      <Heading>Delivery</Heading>
      <Card testID="order-delivery">
        <Body>{`${order.address.line1}, ${order.address.postcode} ${order.address.city}`}</Body>
        <Body soft>{order.slot}</Body>
      </Card>
      <Heading>Items</Heading>
      <Card testID="order-items">
        {order.lines.map((l) => (
          <Body key={l.variantId}>{`${l.qty} × ${productById(l.productId)?.name ?? l.productId}`}</Body>
        ))}
      </Card>
      <TotalsCard totals={order.totals} testID="order-totals" />
      <Button label="Back to shopping" testID="order-continue" onPress={() => router.navigate("/")} />
      {askRating ? (
        <RatingDialog onAnswer={() => update((d) => ({ ...d, ratingAnswered: { ...d.ratingAnswered, [email]: true } }))} />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  step: { flexDirection: "row", alignItems: "center", gap: space.md },
  dot: { width: 16, height: 16, borderRadius: radius.pill, borderWidth: 2, borderColor: colors.accent },
  dotDone: { backgroundColor: colors.accent },
});
