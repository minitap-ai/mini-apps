export interface Artwork {
  emoji: string;
  background: string;
}

const ARTWORK: Record<string, Artwork> = {
  croissant: { emoji: "🥐", background: "#F7D9A8" },
  "pain-au-chocolat": { emoji: "🍫", background: "#E9C9A6" },
  "almond-croissant": { emoji: "🥐", background: "#F1E3C8" },
  baguette: { emoji: "🥖", background: "#F3DDB4" },
  sourdough: { emoji: "🍞", background: "#E8D3B5" },
  brioche: { emoji: "🧈", background: "#FBE7B8" },
  eclair: { emoji: "🍮", background: "#EBCFB9" },
  macaron: { emoji: "🍬", background: "#F6CFD8" },
  "fruit-tart": { emoji: "🍓", background: "#F9D3CB" },
  "cinnamon-roll": { emoji: "🌀", background: "#EDD0AE" },
  quiche: { emoji: "🥧", background: "#F4E0B0" },
  sandwich: { emoji: "🥪", background: "#E3E8C8" },
  coffee: { emoji: "☕", background: "#D9C2AE" },
  "orange-juice": { emoji: "🍊", background: "#FBD9A9" },
};

const PLACEHOLDER: Artwork = { emoji: "🧺", background: "#EFE4D6" };

export function artworkFor(key: string | undefined | null): Artwork {
  return (key && ARTWORK[key]) || PLACEHOLDER;
}
