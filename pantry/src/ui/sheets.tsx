import { useState, type ReactNode } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Body, Button, Toggle } from "./kit";
import { colors, radius, space, type } from "./theme";

export function BottomSheet({ children, testID, onClose }: { children: ReactNode; testID: string; onClose: () => void }) {
  return (
    <Modal transparent animationType="slide" visible onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
        <View style={styles.sheet} testID={testID} accessibilityViewIsModal>
          <View style={styles.handle} />
          {children}
        </View>
      </View>
    </Modal>
  );
}

export function Dialog({ children, testID, onClose }: { children: ReactNode; testID: string; onClose: () => void }) {
  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <View style={[styles.backdrop, { justifyContent: "center", padding: space.xl }]}>
        <View style={styles.dialog} testID={testID} accessibilityViewIsModal>
          {children}
        </View>
      </View>
    </Modal>
  );
}

export function ConsentSheet({ onDone }: { onDone: (choice: "all" | "essential") => void }) {
  const [managing, setManaging] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [ads, setAds] = useState(false);
  if (managing) {
    return (
      <BottomSheet testID="consent-manage" onClose={() => setManaging(false)}>
        <Text style={type.title}>Privacy choices</Text>
        <Toggle label="Essential" hint="Needed for your cart and sign-in" value onChange={() => {}} testID="consent-essential" />
        <Toggle label="Analytics" hint="Helps us improve Pantry" value={analytics} onChange={setAnalytics} testID="consent-analytics" />
        <Toggle label="Personalised offers" value={ads} onChange={setAds} testID="consent-ads" />
        <Button label="Save choices" testID="consent-save" onPress={() => onDone(analytics && ads ? "all" : "essential")} />
      </BottomSheet>
    );
  }
  return (
    <BottomSheet testID="consent-sheet" onClose={() => onDone("essential")}>
      <Text style={type.title}>We value your privacy</Text>
      <Body>We use cookies to keep your basket, measure how Pantry is used and show offers you may like.</Body>
      <Button label="Accept all" testID="consent-accept" onPress={() => onDone("all")} />
      <Button label="Manage choices" testID="consent-open-manage" kind="secondary" onPress={() => setManaging(true)} />
    </BottomSheet>
  );
}

export const WHATS_NEW = [
  { emoji: "⚡", title: "Express delivery", body: "Get your groceries in under an hour in selected areas." },
  { emoji: "🏷️", title: "Deal of the day", body: "One product at 20% off, every day." },
  { emoji: "🔁", title: "Reorder in one tap", body: "Find your past baskets under Orders." },
];

export function WhatsNewSheet({ onClose }: { onClose: () => void }) {
  return (
    <BottomSheet testID="whats-new-sheet" onClose={onClose}>
      <Text style={type.title}>What's new in Pantry</Text>
      {WHATS_NEW.map((item) => (
        <View key={item.title} style={styles.feature}>
          <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={type.bodyStrong}>{item.title}</Text>
            <Text style={type.small}>{item.body}</Text>
          </View>
        </View>
      ))}
      <Button label="Got it" testID="whats-new-close" onPress={onClose} />
    </BottomSheet>
  );
}

export function RatingDialog({ onAnswer }: { onAnswer: (rated: boolean) => void }) {
  const [stars, setStars] = useState(0);
  return (
    <Dialog testID="rating-dialog" onClose={() => onAnswer(false)}>
      <Text style={type.title}>Enjoying Pantry?</Text>
      <Body>Tap a star to rate us. It only takes a second.</Body>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable key={n} testID={`rating-star-${n}`} accessibilityRole="button" accessibilityLabel={`${n} stars`} onPress={() => setStars(n)}>
            <Text style={{ fontSize: 36, color: n <= stars ? "#F5A524" : colors.line }}>★</Text>
          </Pressable>
        ))}
      </View>
      <Button label="Submit" testID="rating-submit" disabled={stars === 0} onPress={() => onAnswer(true)} />
      <Button label="Not now" testID="rating-not-now" kind="ghost" onPress={() => onAnswer(false)} />
    </Dialog>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay, justifyContent: "flex-end" },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: space.xl, paddingBottom: space.xxl, gap: space.md },
  handle: { alignSelf: "center", width: 44, height: 5, borderRadius: 3, backgroundColor: colors.line },
  dialog: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.xl, gap: space.md, width: "100%", maxWidth: 440, alignSelf: "center" },
  feature: { flexDirection: "row", gap: space.md, alignItems: "center" },
  stars: { flexDirection: "row", justifyContent: "center", gap: space.sm },
});
