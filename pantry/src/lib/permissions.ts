import * as Location from "expo-location";
import * as Notifications from "expo-notifications";

export async function askForNotifications(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted || !current.canAskAgain) return current.granted;
  return (await Notifications.requestPermissionsAsync()).granted;
}

/** The city and postcode the phone is in, or null when location is refused or unavailable. */
export async function currentPlace(): Promise<{ city: string; postcode: string } | null> {
  const { granted } = await Location.requestForegroundPermissionsAsync();
  if (!granted) return null;
  try {
    const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
    const [place] = await Location.reverseGeocodeAsync(position.coords);
    return place ? { city: place.city ?? place.region ?? "", postcode: place.postalCode ?? "" } : null;
  } catch {
    return null;
  }
}
