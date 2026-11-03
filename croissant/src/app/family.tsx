import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { api, realtime, type FamilyOrder } from "@/lib/backend";
import { shortTime } from "@/lib/format";
import { useSession } from "@/state/session";
import { asApiError, useLoad } from "@/state/use-load";
import { Body, Button, Card, ErrorState, Field, Heading, Loading, Notice, Screen, Title } from "@/ui/kit";
import { SignInGate } from "@/ui/sign-in-gate";
import { colors, radius, space, type } from "@/ui/theme";

export default function FamilyScreen() {
  const { user, ready } = useSession();
  const family = useLoad(() => (user ? api.family() : Promise.resolve(null)), [user?.id]);
  const [live, setLive] = useState<FamilyOrder[]>([]);
  const [items, setItems] = useState("2 croissants, 1 baguette");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    return realtime.familyOrders((order) => setLive((current) => (current.some((o) => o.id === order.id) ? current : [order, ...current])));
  }, [user?.id]);

  const known = new Set(live.map((o) => o.id));
  const orders = [...live, ...(family.data?.orders ?? []).filter((o) => !known.has(o.id))].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  const start = () => {
    setBusy(true);
    setSent(false);
    setError(null);
    api
      .startFamilyOrder(items.trim(), user?.name || user?.email)
      .then(() => setSent(true))
      .catch((err: unknown) => setError(asApiError(err).message))
      .finally(() => setBusy(false));
  };

  return (
    <Screen testID="family-screen">
      <Title>Family order</Title>
      {!ready || (user && family.loading) ? <Loading testID="family-loading" /> : null}
      {ready && !user ? <SignInGate reason="Sign in with your family account to order together." /> : null}
      {family.error ? <ErrorState message={family.error.message} onRetry={family.reload} testID="family-error" /> : null}
      {user && family.data ? (
        <>
          <Card testID="family-members">
            <Text style={type.heading}>{family.data.family.name}</Text>
            <Body>{family.data.family.members.map((m) => m.name).join(", ")}</Body>
          </Card>
          <Field label="What would you like?" testID="family-items" value={items} onChangeText={setItems} />
          <Button label="Start a family order" testID="family-start-order" busy={busy} disabled={!items.trim()} onPress={start} />
          {sent ? <Notice message="Order sent to your family" testID="family-order-sent" /> : null}
          {error ? <ErrorState message={error} testID="family-order-error" /> : null}
          <Heading>Family orders</Heading>
          <Body soft>New orders from your family appear here automatically.</Body>
          {orders.length === 0 ? <Body testID="family-orders-empty">No family orders yet.</Body> : null}
          <View style={{ gap: space.sm }} testID="family-orders">
            {orders.map((order) => (
              <View
                key={order.id}
                testID={`family-order-${order.id}`}
                style={{ backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, padding: space.md }}
              >
                <Text style={type.bodyStrong}>{order.items}</Text>
                <Text style={type.small}>
                  {order.placedBy} · {shortTime(order.createdAt)}
                </Text>
              </View>
            ))}
          </View>
        </>
      ) : null}
    </Screen>
  );
}
