import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "@/state/app";
import { Body, Button } from "@/ui/kit";
import { colors, radius, space, type } from "@/ui/theme";

const PAGES = [
  { emoji: "🧺", title: "Groceries, delivered", body: "Fresh produce, bakery and pantry staples from local shops." },
  { emoji: "🕐", title: "Pick your slot", body: "Choose a one-hour delivery slot that fits your day." },
  { emoji: "🏷️", title: "A deal every day", body: "One product at 20% off, every day, for everyone." },
];

export default function Onboarding() {
  const { update } = useApp();
  const [page, setPage] = useState(0);
  const current = PAGES[page] ?? PAGES[0]!;
  const last = page === PAGES.length - 1;
  const done = () => {
    update((d) => ({ ...d, onboardingDone: true }));
    router.replace("/");
  };
  return (
    <SafeAreaView style={styles.screen} testID="onboarding-screen">
      <View style={styles.top}>
        <Button label="Skip" testID="onboarding-skip" kind="ghost" onPress={done} />
      </View>
      <View style={styles.body} testID={`onboarding-page-${page + 1}`}>
        <Text style={{ fontSize: 96 }}>{current.emoji}</Text>
        <Text style={[type.display, { textAlign: "center" }]}>{current.title}</Text>
        <Body>{current.body}</Body>
      </View>
      <View style={styles.dots} accessibilityLabel={`Page ${page + 1} of ${PAGES.length}`}>
        {PAGES.map((p, i) => (
          <View key={p.title} style={[styles.dot, i === page && styles.dotActive]} />
        ))}
      </View>
      <Button label={last ? "Get started" : "Next"} testID="onboarding-next" onPress={() => (last ? done() : setPage(page + 1))} style={{ margin: space.xl }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  top: { alignItems: "flex-end", padding: space.md },
  body: { flex: 1, alignItems: "center", justifyContent: "center", gap: space.lg, padding: space.xl },
  dots: { flexDirection: "row", justifyContent: "center", gap: space.sm },
  dot: { width: 10, height: 10, borderRadius: radius.pill, backgroundColor: colors.line },
  dotActive: { backgroundColor: colors.accent, width: 24 },
});
