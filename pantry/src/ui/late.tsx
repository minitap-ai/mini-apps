import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { delayMs, type Delay } from "@/lib/chaos";
import type { Product, Variant } from "@/lib/catalog";
import { euros, saleProductId, unitPriceCents } from "@/lib/pricing";
import { useApp } from "@/state/app";
import { Skeleton } from "./kit";
import { colors, radius, space, type } from "./theme";

/** True once the simulated network answered; the wait is drawn per launch so it changes between runs. */
export function useLate(delay: Delay, key: string): boolean {
  const { chaos, data } = useApp();
  const wait = delayMs(chaos, delay, `${key}:${data.launches}`);
  const [ready, setReady] = useState(wait === 0);
  useEffect(() => {
    if (wait === 0) return setReady(true);
    setReady(false);
    const timer = setTimeout(() => setReady(true), wait);
    return () => clearTimeout(timer);
  }, [wait]);
  return ready;
}

export function ProductImage({ product, size = 88, testID }: { product: Product; size?: number; testID: string }) {
  const ready = useLate("images", product.id);
  if (!ready) return <Skeleton width={size} height={size} testID={`${testID}-loading`} />;
  return (
    <View
      testID={testID}
      accessibilityRole="image"
      accessibilityLabel={`Photo of ${product.name}`}
      style={{ width: size, height: size, borderRadius: radius.md, backgroundColor: product.tint, alignItems: "center", justifyContent: "center" }}
    >
      <Text style={{ fontSize: size * 0.55 }}>{product.emoji}</Text>
    </View>
  );
}

export function Price({ product, variant, testID }: { product: Product; variant: Variant; testID: string }) {
  const ready = useLate("prices", product.id);
  if (!ready) return <Skeleton width={64} height={22} testID={`${testID}-loading`} />;
  const today = new Date();
  const onSale = saleProductId(today) === product.id;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }} testID={testID}>
      <Text style={[type.price, onSale && { color: colors.sale }]}>{euros(unitPriceCents(product, variant, today))}</Text>
      {onSale ? <Text style={[type.small, { textDecorationLine: "line-through" }]}>{euros(variant.priceCents)}</Text> : null}
    </View>
  );
}
