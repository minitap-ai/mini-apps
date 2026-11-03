import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/** Asks Android for permission to show order notifications. */
export async function askForNotifications(): Promise<void> {
  if (Platform.OS !== "android") return;
  const current = await Notifications.getPermissionsAsync();
  if (current.granted || !current.canAskAgain) return;
  await Notifications.requestPermissionsAsync();
}
