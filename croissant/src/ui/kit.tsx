import { type ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { artworkFor } from "@/lib/images";
import { colors, radius, space, type } from "./theme";

export function Screen({ children, testID, scroll = true }: { children: ReactNode; testID: string; scroll?: boolean }) {
  if (!scroll) {
    return (
      <View style={styles.screen} testID={testID}>
        <View style={styles.content}>{children}</View>
      </View>
    );
  }
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} testID={testID} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  );
}

export function Title({ children, testID }: { children: ReactNode; testID?: string }) {
  return (
    <Text style={type.title} accessibilityRole="header" testID={testID}>
      {children}
    </Text>
  );
}

export function Heading({ children, testID }: { children: ReactNode; testID?: string }) {
  return (
    <Text style={[type.heading, { marginTop: space.sm }]} accessibilityRole="header" testID={testID}>
      {children}
    </Text>
  );
}

export function Body({ children, testID, strong, soft }: { children: ReactNode; testID?: string; strong?: boolean; soft?: boolean }) {
  return (
    <Text style={strong ? type.bodyStrong : soft ? type.small : type.body} testID={testID}>
      {children}
    </Text>
  );
}

type ButtonKind = "primary" | "secondary" | "ghost";

export function Button({
  label,
  onPress,
  testID,
  kind = "primary",
  disabled,
  busy,
  style,
}: {
  label: string;
  onPress: () => void;
  testID: string;
  kind?: ButtonKind;
  disabled?: boolean;
  busy?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const inactive = disabled || busy;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: Boolean(inactive), busy: Boolean(busy) }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[kind],
        inactive && styles.buttonDisabled,
        pressed && !inactive && styles.buttonPressed,
        style,
      ]}
    >
      {busy ? <ActivityIndicator color={kind === "primary" ? "#fff" : colors.accent} style={{ marginRight: space.sm }} /> : null}
      <Text style={[styles.buttonLabel, kind === "primary" ? styles.buttonLabelPrimary : styles.buttonLabelSecondary]}>{label}</Text>
    </Pressable>
  );
}

export function LinkRow({ label, hint, onPress, testID }: { label: string; hint?: string; onPress: () => void; testID: string }) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="link"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.linkRow, pressed && styles.buttonPressed]}
    >
      <View style={{ flex: 1 }}>
        <Text style={type.bodyStrong}>{label}</Text>
        {hint ? <Text style={type.small}>{hint}</Text> : null}
      </View>
      <Text style={[type.heading, { color: colors.accent }]}>›</Text>
    </Pressable>
  );
}

export function Card({ children, testID, style }: { children: ReactNode; testID?: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.card, style]} testID={testID}>
      {children}
    </View>
  );
}

export function Loading({ label = "Loading…", testID = "loading" }: { label?: string; testID?: string }) {
  return (
    <View style={styles.loading} testID={testID} accessibilityLabel={label}>
      <ActivityIndicator size="large" color={colors.accent} />
      <Text style={[type.body, { marginTop: space.md }]}>{label}</Text>
    </View>
  );
}

export function ErrorState({ message, onRetry, testID = "error" }: { message: string; onRetry?: () => void; testID?: string }) {
  return (
    <View style={styles.errorBox} testID={testID} accessibilityRole="alert">
      <Text style={[type.bodyStrong, { color: colors.danger }]} testID={`${testID}-message`}>
        {message}
      </Text>
      {onRetry ? <Button label="Retry" onPress={onRetry} testID={`${testID}-retry`} kind="secondary" style={{ marginTop: space.md }} /> : null}
    </View>
  );
}

export function Notice({ message, testID, tone = "success" }: { message: string; testID: string; tone?: "success" | "info" }) {
  return (
    <View style={[styles.notice, tone === "info" && { backgroundColor: colors.accentSoft }]} testID={testID}>
      <Text style={[type.bodyStrong, { color: tone === "success" ? colors.success : colors.ink }]}>{message}</Text>
    </View>
  );
}

export function Skeleton({ width, height = 20, testID }: { width: number; height?: number; testID?: string }) {
  return <View testID={testID} accessibilityLabel="Loading" style={{ width, height, borderRadius: radius.sm, backgroundColor: colors.skeleton }} />;
}

export function Chip({ label, selected, onPress, testID }: { label: string; selected: boolean; onPress: () => void; testID: string }) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[type.bodyStrong, { fontSize: 16, color: selected ? "#fff" : colors.ink }]}>{label}</Text>
    </Pressable>
  );
}

export function Field({ label, testID, ...input }: TextInputProps & { label: string; testID: string }) {
  return (
    <View style={{ gap: space.xs }}>
      <Text style={type.bodyStrong}>{label}</Text>
      <TextInput
        testID={testID}
        accessibilityLabel={label}
        placeholderTextColor={colors.inkSoft}
        style={styles.input}
        {...input}
      />
    </View>
  );
}

export function ProductPhoto({ image, size = 96, testID, label }: { image?: string | null; size?: number; testID?: string; label?: string }) {
  const art = artworkFor(image);
  return (
    <View
      testID={testID}
      accessibilityRole="image"
      accessibilityLabel={label ?? "Photo"}
      style={[styles.photo, { width: size, height: size, backgroundColor: art.background }]}
    >
      <Text style={{ fontSize: size * 0.55 }}>{art.emoji}</Text>
    </View>
  );
}

export function Row({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.row, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: space.lg, gap: space.md, paddingBottom: space.xxl * 2, width: "100%", maxWidth: 720, alignSelf: "center" },
  button: {
    minHeight: 52,
    borderRadius: radius.md,
    paddingHorizontal: space.xl,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  primary: { backgroundColor: colors.accent },
  secondary: { backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.accent },
  ghost: { backgroundColor: "transparent" },
  buttonDisabled: { opacity: 0.5 },
  buttonPressed: { opacity: 0.8 },
  buttonLabel: { fontSize: 18, fontWeight: "800" },
  buttonLabelPrimary: { color: "#fff" },
  buttonLabelSecondary: { color: colors.accentDark },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
    minHeight: 60,
  },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: space.lg, gap: space.sm },
  loading: { alignItems: "center", justifyContent: "center", paddingVertical: space.xxl },
  errorBox: { backgroundColor: colors.dangerSoft, borderRadius: radius.md, padding: space.lg },
  notice: { backgroundColor: colors.successSoft, borderRadius: radius.md, padding: space.lg },
  chip: {
    paddingHorizontal: space.lg,
    minHeight: 44,
    justifyContent: "center",
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
  },
  chipSelected: { backgroundColor: colors.accent },
  input: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingHorizontal: space.lg,
    fontSize: 18,
    color: colors.ink,
  },
  photo: { borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  row: { flexDirection: "row", alignItems: "center", gap: space.md },
});
