import { StyleSheet, Text, View } from "react-native";
import { euros, type Totals } from "@/lib/pricing";
import { Card, Row } from "./kit";
import { colors, space, type } from "./theme";

export function TotalsCard({ totals, testID = "totals" }: { totals: Totals; testID?: string }) {
  return (
    <Card testID={testID}>
      <Line label="Subtotal" value={euros(totals.subtotalCents)} testID={`${testID}-subtotal`} />
      {totals.discountCents > 0 ? <Line label="Discount" value={`−${euros(totals.discountCents)}`} testID={`${testID}-discount`} /> : null}
      <Line label="Delivery" value={totals.deliveryCents === 0 ? "Free" : euros(totals.deliveryCents)} testID={`${testID}-delivery`} />
      <View style={styles.rule} />
      <Line label="Total" value={euros(totals.totalCents)} testID={`${testID}-total`} strong />
    </Card>
  );
}

function Line({ label, value, testID, strong }: { label: string; value: string; testID: string; strong?: boolean }) {
  return (
    <Row style={{ justifyContent: "space-between" }}>
      <Text style={strong ? type.bodyStrong : type.body}>{label}</Text>
      <Text style={strong ? type.price : type.body} testID={testID}>{value}</Text>
    </Row>
  );
}

const styles = StyleSheet.create({ rule: { height: 1, backgroundColor: colors.line, marginVertical: space.xs } });
