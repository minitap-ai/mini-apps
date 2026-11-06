import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { happens } from "@/lib/chaos";
import { statusAt } from "@/lib/orders";
import { euros } from "@/lib/pricing";
import { useApp, useUser } from "@/state/app";
import { Body, Button, ErrorState, LinkRow, Loading, Screen, Title } from "@/ui/kit";
import { space, type } from "@/ui/theme";

export default function Orders() {
  const { chaos, data } = useApp();
  const { account, orders } = useUser();
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<"loading" | "error" | "ready">("loading");

  useEffect(() => {
    setState("loading");
    const timer = setTimeout(() => setState(attempt === 0 && happens(chaos, "ordersError", data.launches) ? "error" : "ready"), 700);
    return () => clearTimeout(timer);
  }, [attempt, chaos, data.launches]);

  if (!account) {
    return (
      <Screen testID="orders-screen">
        <Title>Your orders</Title>
        <Body>Sign in to see your orders.</Body>
        <Button label="Sign in" testID="orders-sign-in" onPress={() => router.push("/sign-in")} />
      </Screen>
    );
  }
  return (
    <Screen testID="orders-screen">
      <Title>Your orders</Title>
      {state === "loading" ? <Loading label="Loading your orders…" testID="orders-loading" /> : null}
      {state === "error" ? <ErrorState message="Something went wrong. Please try again." onRetry={() => setAttempt(attempt + 1)} testID="orders-error" /> : null}
      {state === "ready" && orders.length === 0 ? <Body testID="orders-empty">You have no orders yet.</Body> : null}
      {state === "ready" ? (
        <View style={{ gap: space.sm }} testID="orders-list">
          {orders.map((o) => (
            <LinkRow
              key={o.id}
              testID={`order-row-${o.number}`}
              label={`Order ${o.number}`}
              hint={`${new Date(o.placedAt).toLocaleDateString("en-GB")} · ${euros(o.totals.totalCents)} · ${statusAt(o, new Date())}`}
              onPress={() => router.push(`/order/${o.id}`)}
            />
          ))}
        </View>
      ) : null}
      {state === "ready" && orders.length > 0 ? <Text style={type.small}>Orders are kept on this phone.</Text> : null}
    </Screen>
  );
}
