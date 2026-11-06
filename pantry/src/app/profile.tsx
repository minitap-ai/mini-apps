import { Redirect, router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { validAddress } from "@/lib/orders";
import { useUser } from "@/state/app";
import { Button, Field, Heading, Row, Screen } from "@/ui/kit";
import { colors, type } from "@/ui/theme";
import { useToast } from "@/ui/toast";

export default function Profile() {
  const user = useUser();
  const toast = useToast();
  const [name, setName] = useState(user.name);
  const [address, setAddress] = useState(user.address ?? { line1: "", city: "", postcode: "" });
  const [error, setError] = useState<string | null>(null);
  if (!user.account) return <Redirect href="/sign-in" />;
  const save = () => {
    if (!name.trim()) return setError("Enter your name.");
    const hasAddress = address.line1 || address.city || address.postcode;
    const problem = hasAddress ? validAddress(address) : null;
    if (problem) return setError(problem);
    user.setName(name.trim());
    if (hasAddress) user.setAddress(address);
    toast("Profile saved");
    router.back();
  };
  return (
    <Screen testID="profile-screen">
      <Field label="Full name" testID="profile-name" value={name} onChangeText={setName} autoComplete="name" />
      <Heading>Delivery address</Heading>
      <Field label="Street address" testID="profile-street" value={address.line1} onChangeText={(line1) => setAddress({ ...address, line1 })} />
      <Row>
        <View style={{ flex: 2 }}>
          <Field label="City" testID="profile-city" value={address.city} onChangeText={(city) => setAddress({ ...address, city })} />
        </View>
        <View style={{ flex: 1 }}>
          <Field label="Postcode" testID="profile-postcode" value={address.postcode} onChangeText={(postcode) => setAddress({ ...address, postcode })} keyboardType="number-pad" maxLength={5} />
        </View>
      </Row>
      {error ? <Text style={[type.bodyStrong, { color: colors.danger }]} testID="profile-error">{error}</Text> : null}
      <Button label="Save" testID="profile-save" onPress={save} />
    </Screen>
  );
}
