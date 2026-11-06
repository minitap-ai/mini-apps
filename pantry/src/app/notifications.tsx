import { Redirect } from "expo-router";
import { useUser } from "@/state/app";
import { Body, Screen, Toggle } from "@/ui/kit";

export default function NotificationSettings() {
  const user = useUser();
  if (!user.account) return <Redirect href="/sign-in" />;
  const { prefs, setPrefs } = user;
  return (
    <Screen testID="notifications-screen">
      <Toggle label="Order updates" hint="When your order is packed and on its way" value={prefs.orderUpdates} onChange={(orderUpdates) => setPrefs({ ...prefs, orderUpdates })} testID="pref-order-updates" />
      <Toggle label="Offers" hint="The deal of the day and seasonal offers" value={prefs.offers} onChange={(offers) => setPrefs({ ...prefs, offers })} testID="pref-offers" />
      <Toggle label="Weekly newsletter" value={prefs.newsletter} onChange={(newsletter) => setPrefs({ ...prefs, newsletter })} testID="pref-newsletter" />
      <Body soft>Changes are saved right away.</Body>
    </Screen>
  );
}
