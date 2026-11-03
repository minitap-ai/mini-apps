import { useState } from "react";
import { Text } from "react-native";
import { api, type Reward } from "@/lib/backend";
import { useSession } from "@/state/session";
import { asApiError, useLoad } from "@/state/use-load";
import { Body, Button, Card, ErrorState, Heading, Loading, Notice, Row, Screen, Title } from "@/ui/kit";
import { SignInGate } from "@/ui/sign-in-gate";
import { colors, type } from "@/ui/theme";

export default function LoyaltyScreen() {
  const { user, ready } = useSession();
  const loyalty = useLoad(() => (user ? api.loyalty() : Promise.resolve(null)), [user?.id]);
  const [busy, setBusy] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const redeem = (reward: Reward) => {
    setBusy(reward.id);
    setDone(null);
    setError(null);
    api
      .redeem(reward.id)
      .then((r) => {
        if (loyalty.data) loyalty.setData({ ...loyalty.data, points: r.points });
        setDone(`Redeemed: ${r.redeemed.name}. Your new balance is ${r.points} points.`);
      })
      .catch((err: unknown) => setError(asApiError(err).message))
      .finally(() => setBusy(null));
  };

  return (
    <Screen testID="loyalty-screen">
      <Title>Loyalty</Title>
      {!ready || (user && loyalty.loading) ? <Loading testID="loyalty-loading" /> : null}
      {ready && !user ? <SignInGate reason="Sign in to see your points and rewards." /> : null}
      {loyalty.error ? (
        loyalty.error.needsSignIn ? (
          <SignInGate reason="Sign in to see your points and rewards." />
        ) : (
          <ErrorState message={loyalty.error.message} onRetry={loyalty.reload} testID="loyalty-error" />
        )
      ) : null}
      {user && loyalty.data ? (
        <>
          <Card>
            <Text style={[type.display, { color: colors.accentDark }]} testID="loyalty-points">
              Your points: {loyalty.data.points}
            </Text>
          </Card>
          {done ? <Notice message={done} testID="loyalty-redeemed" /> : null}
          {error ? <ErrorState message={error} testID="loyalty-redeem-error" /> : null}
          <Heading>Rewards</Heading>
          {loyalty.data.rewards.map((reward) => (
            <Card key={reward.id} testID={`reward-${reward.id}`}>
              <Row style={{ justifyContent: "space-between" }}>
                <Body strong>{reward.name}</Body>
                <Body>{reward.cost} points</Body>
              </Row>
              <Button
                label={`Redeem (${reward.cost} points)`}
                testID={`redeem-${reward.id}`}
                busy={busy === reward.id}
                disabled={busy !== null}
                onPress={() => redeem(reward)}
              />
            </Card>
          ))}
        </>
      ) : null}
    </Screen>
  );
}
