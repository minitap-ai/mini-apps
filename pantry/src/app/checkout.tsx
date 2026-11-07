import { Redirect, router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { happens } from "@/lib/chaos";
import { DELIVERY_SLOTS, nextOrderNumber, validAddress, validCard, type Address, type Order } from "@/lib/orders";
import { currentPlace } from "@/lib/permissions";
import { useApp, useUser } from "@/state/app";
import { useCart } from "@/state/cart";
import { Body, Button, Chip, Field, Heading, Row, Screen } from "@/ui/kit";
import { colors, space, type } from "@/ui/theme";
import { TotalsCard } from "@/ui/totals";

export default function Checkout() {
  const { chaos, update } = useApp();
  const user = useUser();
  const cart = useCart();
  const [address, setAddress] = useState<Address>(user.address ?? { line1: "", city: "", postcode: "" });
  const [slot, setSlot] = useState<string | null>(null);
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });
  const [error, setError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [busy, setBusy] = useState(false);
  const swapped = happens(chaos, "checkoutButtonsSwapped");

  if (!user.account) return <Redirect href="/sign-in?next=checkout" />;
  if (cart.lines.length === 0) return <Redirect href="/cart" />;
  const email = user.account.email;

  const locate = async () => {
    setLocating(true);
    const place = await currentPlace();
    setLocating(false);
    if (!place) return setError("We couldn't find your location. Enter your address instead.");
    setError(null);
    setAddress((a) => ({ ...a, city: place.city || a.city, postcode: place.postcode || a.postcode }));
  };

  const placeOrder = () => {
    const problem = validAddress(address) ?? (slot ? null : "Choose a delivery slot.") ?? validCard(card.number, card.expiry, card.cvc);
    if (problem) return setError(problem);
    setError(null);
    setBusy(true);
    setTimeout(() => {
      const orders = user.orders;
      const order: Order = {
        id: `${Date.now()}`,
        number: nextOrderNumber(orders),
        placedAt: new Date().toISOString(),
        lines: cart.lines,
        totals: cart.totals,
        address,
        slot: slot as string,
      };
      update((d) => ({
        ...d,
        cart: [],
        promoCode: null,
        addresses: { ...d.addresses, [email]: address },
        orders: { ...d.orders, [email]: [order, ...(d.orders[email] ?? [])] },
      }));
      setBusy(false);
      router.replace(`/order/${order.id}?placed=1`);
    }, 1200);
  };

  const buttons = [
    <Button key="place" label="Place order" testID="checkout-place-order" busy={busy} onPress={placeOrder} />,
    <Button key="back" label="Back to cart" testID="checkout-back" kind="secondary" onPress={() => router.back()} />,
  ];

  return (
    <Screen testID="checkout-screen">
      <Heading>Delivery address</Heading>
      <Field label="Street address" testID="checkout-street" value={address.line1} onChangeText={(line1) => setAddress({ ...address, line1 })} autoComplete="street-address" />
      <Row>
        <View style={{ flex: 2 }}>
          <Field label="City" testID="checkout-city" value={address.city} onChangeText={(city) => setAddress({ ...address, city })} />
        </View>
        <View style={{ flex: 1 }}>
          <Field label="Postcode" testID="checkout-postcode" value={address.postcode} onChangeText={(postcode) => setAddress({ ...address, postcode })} keyboardType="number-pad" maxLength={5} />
        </View>
      </Row>
      <Button label="Use my location" testID="checkout-use-location" kind="ghost" busy={locating} onPress={locate} />
      <Heading>Delivery slot</Heading>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.sm }}>
        {DELIVERY_SLOTS.map((s, i) => (
          <Chip key={s} label={s} selected={slot === s} onPress={() => setSlot(s)} testID={`checkout-slot-${i + 1}`} />
        ))}
      </View>
      <Heading>Payment</Heading>
      <Field label="Card number" testID="checkout-card-number" value={card.number} onChangeText={(number) => setCard({ ...card, number })} keyboardType="number-pad" maxLength={19} placeholder="1234 5678 9012 3456" />
      <Row>
        <View style={{ flex: 1 }}>
          <Field label="Expiry (MM/YY)" testID="checkout-card-expiry" value={card.expiry} onChangeText={(expiry) => setCard({ ...card, expiry })} maxLength={5} placeholder="MM/YY" />
        </View>
        <View style={{ flex: 1 }}>
          <Field label="CVC" testID="checkout-card-cvc" value={card.cvc} onChangeText={(cvc) => setCard({ ...card, cvc })} keyboardType="number-pad" maxLength={3} secureTextEntry />
        </View>
      </Row>
      <TotalsCard totals={cart.totals} testID="checkout-totals" />
      <Body soft>Payment is simulated: no card is charged.</Body>
      {error ? <Text style={[type.bodyStrong, { color: colors.danger }]} testID="checkout-error">{error}</Text> : null}
      {swapped ? [...buttons].reverse() : buttons}
    </Screen>
  );
}
