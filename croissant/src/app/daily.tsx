import { Text, View } from "react-native";
import { api } from "@/lib/backend";
import { money, titleCase } from "@/lib/format";
import { useLoad } from "@/state/use-load";
import { AddButton } from "@/ui/add-button";
import { Body, ErrorState, Loading, ProductPhoto, Screen, Title } from "@/ui/kit";
import { colors, radius, type } from "@/ui/theme";

const PHOTO_SIZE = 240;

export default function DailyScreen() {
  const daily = useLoad(() => api.daily());
  const photo = useLoad(() => api.dailyPhoto());
  const p = daily.data?.product;

  return (
    <Screen testID="daily-screen">
      <Title>Croissant of the day</Title>
      {photo.data ? (
        <ProductPhoto image={photo.data.image} size={PHOTO_SIZE} label={photo.data.alt ?? p?.name} testID="daily-photo" />
      ) : photo.error ? (
        <ErrorState message="We couldn't load the photo." onRetry={photo.reload} testID="daily-photo-error" />
      ) : (
        <View
          testID="daily-photo-loading"
          style={{ width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: radius.md, backgroundColor: colors.skeleton, alignItems: "center", justifyContent: "center" }}
        >
          <Body soft>Loading photo…</Body>
        </View>
      )}
      {daily.loading ? <Loading testID="daily-loading" /> : null}
      {daily.error ? <ErrorState message={daily.error.message} onRetry={daily.reload} testID="daily-error" /> : null}
      {p ? (
        <>
          <Text style={type.title} testID="daily-name">
            {p.name}
          </Text>
          <Text style={[type.price, { fontSize: 24 }]} testID="daily-price">
            {money(p.price, p.currency)}
          </Text>
          <Body testID="daily-allergens">Allergens: {p.allergens.length ? p.allergens.map(titleCase).join(", ") : "None"}</Body>
          <AddButton productId={p.id} label="Add to cart" testID="daily-add" />
        </>
      ) : null}
    </Screen>
  );
}
