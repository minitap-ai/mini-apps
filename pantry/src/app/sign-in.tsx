import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text } from "react-native";
import { checkCode, checkPassword, type Account } from "@/lib/accounts";
import { useUser } from "@/state/app";
import { Body, Button, Field, Screen, Title } from "@/ui/kit";
import { colors, type } from "@/ui/theme";

export default function SignIn() {
  const { next } = useLocalSearchParams<{ next?: string }>();
  const { signIn } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pending, setPending] = useState<Account | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const finish = (account: Account) => {
    signIn(account);
    if (next === "checkout") router.replace("/checkout");
    else router.back();
  };

  const submitPassword = () => {
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      const result = checkPassword(email, password);
      if (!result.ok) return setError(result.error);
      setError(null);
      if (result.needsCode) setPending(result.account);
      else finish(result.account);
    }, 600);
  };

  if (pending) {
    return (
      <Screen testID="sign-in-code-screen">
        <Title>Enter your code</Title>
        <Body>{`We sent a 6-digit code to the phone number on ${pending.email}.`}</Body>
        <Field label="Verification code" testID="sign-in-code" value={code} onChangeText={setCode} keyboardType="number-pad" maxLength={6} />
        {error ? <Text style={[type.bodyStrong, { color: colors.danger }]} testID="sign-in-error">{error}</Text> : null}
        <Button
          label="Verify"
          testID="sign-in-verify"
          disabled={code.length < 6}
          onPress={() => (checkCode(pending, code) ? finish(pending) : setError("This code is not valid."))}
        />
      </Screen>
    );
  }

  return (
    <Screen testID="sign-in-screen">
      <Title>Welcome back</Title>
      <Field label="Email" testID="sign-in-email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" />
      <Field label="Password" testID="sign-in-password" value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" />
      {error ? <Text style={[type.bodyStrong, { color: colors.danger }]} testID="sign-in-error">{error}</Text> : null}
      <Button label="Sign in" testID="sign-in-submit" busy={busy} disabled={!email || !password} onPress={submitPassword} />
    </Screen>
  );
}
