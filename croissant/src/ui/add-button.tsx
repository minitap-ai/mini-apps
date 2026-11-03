import { useState } from "react";
import { useCart } from "@/state/cart";
import { asApiError } from "@/state/use-load";
import { Button } from "./kit";
import { useToast } from "./toast";

export function AddButton({ productId, label = "Add", testID }: { productId: string; label?: string; testID: string }) {
  const { add } = useCart();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  return (
    <Button
      label={label}
      testID={testID}
      busy={busy}
      onPress={() => {
        setBusy(true);
        add(productId)
          .catch((err: unknown) => toast(asApiError(err).message, 3000))
          .finally(() => setBusy(false));
      }}
    />
  );
}
