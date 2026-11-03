import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text } from "react-native";
import { api, auth } from "@/lib/backend";
import { useSession } from "@/state/session";
import { asApiError } from "@/state/use-load";
import { Body, Button, Card, ErrorState, Field, Loading, Notice, Screen, Title } from "@/ui/kit";
import { colors, type } from "@/ui/theme";

export default function SignInScreen() {
  const { user, ready, signIn, signOut } = useSession();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sms, setSms] = useState(false);
  const [phone, setPhone] = useState("");
  const [smsMessage, setSmsMessage] = useState<string | null>(null);

  const run = (task: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    task()
      .catch((err: unknown) => setError(asApiError(err).message))
      .finally(() => setBusy(false));
  };

  if (!ready) return <Loading testID="sign-in-loading" />;

  if (user) {
    return (
      <Screen testID="account-screen">
        <Title>Your account</Title>
        <Card>
          <Body soft>Signed in as</Body>
          <Text style={type.heading} testID="account-email">
            {user.email}
          </Text>
        </Card>
        <Button label="My orders" kind="secondary" testID="account-orders" onPress={() => router.push("/orders")} />
        <Button label="Sign out" kind="secondary" testID="account-sign-out" busy={busy} onPress={() => run(signOut)} />
      </Screen>
    );
  }

  return (
    <Screen testID="sign-in-screen">
      <Title>Sign in</Title>
      <Field
        label="Email"
        placeholder="you@example.com"
        testID="sign-in-email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        autoComplete="email"
      />
      <Button
        label={userId ? "Send me a new code" : "Send me a code"}
        kind={userId ? "secondary" : "primary"}
        testID="sign-in-send-code"
        busy={busy && !userId}
        disabled={!email.includes("@")}
        onPress={() =>
          run(async () => {
            setUserId(await auth.sendEmailCode(email));
          })
        }
      />
      {userId ? (
        <>
          <Notice message={`We sent a 6-digit code to ${email.trim()}.`} testID="sign-in-code-sent" tone="info" />
          <Field
            label="6-digit code"
            placeholder="123456"
            testID="sign-in-code"
            value={code}
            onChangeText={(v) => setCode(v.replace(/\D/g, "").slice(0, 6))}
            keyboardType="number-pad"
            autoComplete="one-time-code"
            maxLength={6}
          />
          <Button
            label="Sign in"
            testID="sign-in-submit"
            busy={busy}
            disabled={code.length !== 6}
            onPress={() =>
              run(async () => {
                await signIn(userId, code);
                if (router.canGoBack()) router.back();
                else router.replace("/");
              })
            }
          />
        </>
      ) : null}
      {error ? <ErrorState message={error} testID="sign-in-error" /> : null}
      <Pressable testID="sign-in-sms-link" accessibilityRole="link" onPress={() => setSms(true)}>
        <Text style={[type.bodyStrong, { color: colors.accentDark, textDecorationLine: "underline" }]}>Text me a code instead</Text>
      </Pressable>
      {sms ? (
        <Card testID="sms-form">
          <Field
            label="Phone number"
            placeholder="+33 6 12 34 56 78"
            testID="sms-phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoComplete="tel"
          />
          <Button
            label="Send SMS"
            testID="sms-send"
            busy={busy}
            disabled={phone.replace(/\D/g, "").length < 6}
            onPress={() =>
              run(async () => {
                setSmsMessage((await api.sendSms(phone)).message);
              })
            }
          />
          {smsMessage ? <Notice message={smsMessage} testID="sms-sent" /> : null}
        </Card>
      ) : null}
    </Screen>
  );
}
