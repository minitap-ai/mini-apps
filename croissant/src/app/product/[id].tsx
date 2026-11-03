import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { api } from "@/lib/backend";
import { money, titleCase } from "@/lib/format";
import { useLoad } from "@/state/use-load";
import { AddButton } from "@/ui/add-button";
import { Body, Card, ErrorState, Loading, ProductPhoto, Screen, Title } from "@/ui/kit";
import { type } from "@/ui/theme";

export default function ProductScreen() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const product = useLoad(() => api.product(id), [id]);
  const p = product.data?.product;

  return (
    <Screen testID="product-screen">
      {product.loading ? <Loading testID="product-loading" /> : null}
      {product.error ? <ErrorState message={product.error.message} onRetry={product.reload} testID="product-error" /> : null}
      {p ? (
        <>
          <ProductPhoto image={p.image} size={220} label={p.name} testID="product-photo" />
          <Title testID="product-name">{p.name}</Title>
          <Text style={[type.price, { fontSize: 24 }]} testID="product-price">
            {money(p.price, p.currency)}
          </Text>
          {p.description ? <Body>{p.description}</Body> : null}
          <Card testID="product-allergens">
            <Body strong>Allergens</Body>
            <Body>{p.allergens.length ? p.allergens.map(titleCase).join(", ") : "None"}</Body>
          </Card>
          <AddButton productId={p.id} label="Add to cart" testID="product-add" />
        </>
      ) : null}
    </Screen>
  );
}
