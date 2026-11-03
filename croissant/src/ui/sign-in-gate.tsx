import { router } from "expo-router";
import { Body, Button, Card } from "./kit";

export function SignInGate({ reason, testID = "sign-in-gate" }: { reason: string; testID?: string }) {
  return (
    <Card testID={testID}>
      <Body strong>Sign in to continue</Body>
      <Body soft>{reason}</Body>
      <Button label="Sign in" testID={`${testID}-button`} onPress={() => router.push("/sign-in")} />
    </Card>
  );
}
