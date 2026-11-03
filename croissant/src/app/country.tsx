import { Text, View } from "react-native";
import { api, locale } from "@/lib/backend";
import { money } from "@/lib/format";
import { useLoad } from "@/state/use-load";
import { Body, Card, ErrorState, Heading, Loading, Screen, Title } from "@/ui/kit";
import { space, type } from "@/ui/theme";

async function loadCountryMenu() {
  const code = await locale.countryCode().catch(() => null);
  return api.menu(code ?? undefined);
}

export default function CountryScreen() {
  const menu = useLoad(loadCountryMenu);
  const country = menu.data?.country;

  return (
    <Screen testID="country-screen">
      <Title>Our menu in your country</Title>
      {menu.loading ? <Loading label="Finding your country…" testID="country-loading" /> : null}
      {menu.error ? <ErrorState message={menu.error.message} onRetry={menu.reload} testID="country-error" /> : null}
      {menu.data && !country ? (
        <Card testID="country-unknown">
          <Body strong>We don't have a local menu for your country yet.</Body>
          <Body>Prices are shown in {menu.data.currency}.</Body>
        </Card>
      ) : null}
      {country ? (
        <>
          <Card testID="country-card">
            <Text style={type.display} testID="country-name">
              {country.name}
            </Text>
            <Body testID="country-currency">Currency: {country.currency}</Body>
          </Card>
          <Heading>Local specials</Heading>
          <View style={{ gap: space.sm }}>
            {country.specials.map((s) => (
              <Card key={s.id} testID={`special-${s.id}`}>
                <Text style={type.bodyStrong}>{s.name}</Text>
                <Text style={type.price}>{money(s.price, country.currency)}</Text>
              </Card>
            ))}
          </View>
        </>
      ) : null}
    </Screen>
  );
}
