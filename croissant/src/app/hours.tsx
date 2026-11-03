import { Text, View } from "react-native";
import { api } from "@/lib/backend";
import { useLoad } from "@/state/use-load";
import { Card, ErrorState, Loading, Screen, Title } from "@/ui/kit";
import { colors, space, type } from "@/ui/theme";

export default function HoursScreen() {
  const hours = useLoad(() => api.hours());
  return (
    <Screen testID="hours-screen">
      <Title>Opening hours</Title>
      {hours.loading ? <Loading testID="hours-loading" /> : null}
      {hours.error ? <ErrorState message="We couldn't load opening hours." onRetry={hours.reload} testID="hours-error" /> : null}
      {hours.data && !hours.loading ? (
        <Card testID="hours-list">
          {hours.data.days.map((d) => (
            <View
              key={d.day}
              style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: space.sm, borderBottomWidth: 1, borderBottomColor: colors.line }}
              testID={`hours-${d.day.toLowerCase()}`}
            >
              <Text style={type.bodyStrong}>{d.day}</Text>
              <Text style={type.body}>{d.closed ? "Closed" : `${d.opens} – ${d.closes}`}</Text>
            </View>
          ))}
        </Card>
      ) : null}
    </Screen>
  );
}
