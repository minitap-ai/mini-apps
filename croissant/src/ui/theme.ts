export const colors = {
  background: "#FFF8EE",
  surface: "#FFFFFF",
  surfaceWarm: "#FBEBD3",
  ink: "#3A2416",
  inkSoft: "#6E5444",
  line: "#EADBC6",
  accent: "#B8651B",
  accentDark: "#8F4C12",
  accentSoft: "#F6E1C3",
  success: "#2F7A4B",
  successSoft: "#DFF1E5",
  danger: "#B3261E",
  dangerSoft: "#FBE3E0",
  skeleton: "#EFE2D0",
  overlay: "rgba(43, 26, 15, 0.55)",
};

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { sm: 8, md: 14, lg: 20, pill: 999 };

export const type = {
  display: { fontSize: 30, fontWeight: "800" as const, color: colors.ink, lineHeight: 36 },
  title: { fontSize: 24, fontWeight: "800" as const, color: colors.ink, lineHeight: 30 },
  heading: { fontSize: 19, fontWeight: "700" as const, color: colors.ink, lineHeight: 25 },
  body: { fontSize: 17, fontWeight: "400" as const, color: colors.ink, lineHeight: 24 },
  bodyStrong: { fontSize: 17, fontWeight: "700" as const, color: colors.ink, lineHeight: 24 },
  small: { fontSize: 15, fontWeight: "400" as const, color: colors.inkSoft, lineHeight: 21 },
  price: { fontSize: 18, fontWeight: "800" as const, color: colors.accentDark, lineHeight: 24 },
};
