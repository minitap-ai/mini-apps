import { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import type { Interruption } from "@/lib/backend";
import { askForNotifications } from "@/lib/notifications";
import { Body, Button } from "./kit";
import { colors, radius, space, type } from "./theme";

const KNOWN = new Set(["newsletter", "notification_permission"]);

/** Shows the prompts the bakery asks for on the home screen, one after another. */
export function Interruptions({ items }: { items: Interruption[] }) {
  const [index, setIndex] = useState(0);
  const current = items.filter((item) => KNOWN.has(item.kind))[index];
  const next = () => setIndex((i) => i + 1);

  useEffect(() => {
    if (current?.kind !== "notification_permission") return;
    askForNotifications()
      .catch(() => undefined)
      .finally(next);
  }, [current]);

  useEffect(() => setIndex(0), [items]);

  if (!current) return null;
  if (current.kind === "newsletter") return <Newsletter title={current.title} body={current.body} onClose={next} />;
  return null;
}

function Newsletter({ title, body, onClose }: { title: string; body?: string; onClose: () => void }) {
  const [joined, setJoined] = useState(false);
  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet} testID="newsletter-modal" accessibilityViewIsModal>
          <Text style={type.title}>{joined ? "Thanks for joining!" : title}</Text>
          <Body>{joined ? "Look out for our weekly treats." : (body ?? "Fresh offers from the oven, once a week.")}</Body>
          {joined ? (
            <Button label="Close" testID="newsletter-close" onPress={onClose} />
          ) : (
            <>
              <Button label="Sign me up" testID="newsletter-join" onPress={() => setJoined(true)} />
              <Button label="No thanks" testID="newsletter-dismiss" kind="secondary" onPress={onClose} />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay, alignItems: "center", justifyContent: "center", padding: space.xl },
  sheet: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.xl, gap: space.md, width: "100%", maxWidth: 440 },
});
