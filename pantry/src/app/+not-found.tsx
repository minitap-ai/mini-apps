import { router } from "expo-router";
import { Body, Button, Screen, Title } from "@/ui/kit";

export default function NotFound() {
  return (
    <Screen testID="not-found-screen">
      <Title>Page not found</Title>
      <Body>This page does not exist.</Body>
      <Button label="Go to Home" testID="not-found-home" onPress={() => router.replace("/")} />
    </Screen>
  );
}
