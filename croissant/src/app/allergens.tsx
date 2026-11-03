import { StyleSheet, Text, View } from "react-native";
import { api } from "@/lib/backend";
import { titleCase } from "@/lib/format";
import { useLoad } from "@/state/use-load";
import { Body, Card, ErrorState, Heading, Loading, Screen, Title } from "@/ui/kit";
import { colors, space, type } from "@/ui/theme";

export default function AllergensScreen() {
  const legal = useLoad(() => api.legal());
  return (
    <Screen testID="allergens-screen">
      <Title>Allergens & legal</Title>
      {legal.loading ? <Loading testID="allergens-loading" /> : null}
      {legal.error ? <ErrorState message={legal.error.message} onRetry={legal.reload} testID="allergens-error" /> : null}
      {legal.data ? (
        <>
          <Card testID="allergen-table">
            <View style={[styles.row, styles.head]}>
              <Text style={[type.bodyStrong, styles.product]}>Product</Text>
              <Text style={[type.bodyStrong, styles.allergens]}>Contains</Text>
            </View>
            {legal.data.allergenTable.map((row) => (
              <View key={row.product} style={styles.row} testID={`allergen-row-${row.product}`}>
                <Text style={[type.body, styles.product]}>{row.product}</Text>
                <Text style={[type.body, styles.allergens]}>{row.allergens.length ? row.allergens.map(titleCase).join(", ") : "None"}</Text>
              </View>
            ))}
          </Card>
          <Heading>Legal notice</Heading>
          <Body testID="legal-notice">{legal.data.notice}</Body>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", paddingVertical: space.sm, borderBottomWidth: 1, borderBottomColor: colors.line, gap: space.md },
  head: { borderBottomWidth: 2 },
  product: { flex: 1 },
  allergens: { flex: 1.3 },
});
