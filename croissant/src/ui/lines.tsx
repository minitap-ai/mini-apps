import { Text, View } from "react-native";
import type { CartLine } from "@/lib/backend";
import { money } from "@/lib/format";
import { space, type } from "./theme";

export function Lines({ lines, currency, testID }: { lines: CartLine[]; currency: string; testID: string }) {
  return (
    <View style={{ gap: space.xs }} testID={testID}>
      {lines.map((line) => (
        <View key={line.productId} style={{ flexDirection: "row", justifyContent: "space-between" }} testID={`${testID}-${line.productId}`}>
          <Text style={type.body}>
            {line.qty} × {line.name}
          </Text>
          <Text style={type.bodyStrong}>{money(line.lineTotal, currency)}</Text>
        </View>
      ))}
    </View>
  );
}

export function AmountRow({ label, amount, currency, testID, strong }: { label: string; amount: number; currency: string; testID: string; strong?: boolean }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }} testID={testID}>
      <Text style={strong ? [type.heading] : type.body}>{label}</Text>
      <Text style={strong ? [type.heading] : type.bodyStrong} testID={`${testID}-amount`}>
        {money(amount, currency)}
      </Text>
    </View>
  );
}
