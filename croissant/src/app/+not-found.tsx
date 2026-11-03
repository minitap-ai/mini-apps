import { router } from "expo-router";
import { Body, Button, Screen, Title } from "@/ui/kit";

export default function NotFoundScreen() {
  return (
    <Screen testID="not-found-screen">
      <Title>Page not found</Title>
      <Body>This page has gone stale. Let's get you something fresh.</Body>
      <Button label="Back to home" testID="not-found-home" onPress={() => router.replace("/")} />
    </Screen>
  );
}
