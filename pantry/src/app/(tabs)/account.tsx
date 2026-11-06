import { router } from "expo-router";
import { useState } from "react";
import { Alert, Platform, Text } from "react-native";
import { useUser } from "@/state/app";
import { Body, Button, LinkRow, Screen, Title } from "@/ui/kit";
import { Dialog } from "@/ui/sheets";
import { type } from "@/ui/theme";

export default function Account() {
  const user = useUser();
  const [confirmDelete, setConfirmDelete] = useState(false);
  if (!user.account) {
    return (
      <Screen testID="account-screen">
        <Title>Account</Title>
        <Body>Sign in to see your orders, addresses and settings.</Body>
        <Button label="Sign in" testID="account-sign-in" onPress={() => router.push("/sign-in")} />
      </Screen>
    );
  }
  const signOut = () => {
    if (Platform.OS === "web") return user.signOut();
    Alert.alert("Sign out?", "Your cart will be emptied.", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: user.signOut },
    ]);
  };
  return (
    <Screen testID="account-screen">
      <Title testID="account-name">{user.name}</Title>
      <Body soft testID="account-email">{user.account.email}</Body>
      <LinkRow label="Edit profile" hint="Name and delivery address" testID="account-edit-profile" onPress={() => router.push("/profile")} />
      <LinkRow label="Notifications" hint="Order updates and offers" testID="account-notifications" onPress={() => router.push("/notifications")} />
      <LinkRow label="Your orders" testID="account-orders" onPress={() => router.navigate("/orders")} />
      <Button label="Sign out" testID="account-sign-out" kind="secondary" onPress={signOut} />
      <Button label="Delete account" testID="account-delete" kind="ghost" onPress={() => setConfirmDelete(true)} />
      {confirmDelete ? (
        <Dialog testID="delete-dialog" onClose={() => setConfirmDelete(false)}>
          <Text style={type.title}>Delete your account?</Text>
          <Body>Your orders, addresses and settings will be removed from this phone.</Body>
          <Button label="Delete" testID="delete-confirm" onPress={() => { setConfirmDelete(false); user.deleteAccount(); }} />
          <Button label="Cancel" testID="delete-cancel" kind="secondary" onPress={() => setConfirmDelete(false)} />
        </Dialog>
      ) : null}
    </Screen>
  );
}
