export const colors = {
  background: "#F3FAF5",
  surface: "#FFFFFF",
  surfaceWarm: "#E2F2E7",
  ink: "#17301F",
  inkSoft: "#4F6656",
  line: "#D3E6D9",
  accent: "#2E7D50",
  accentDark: "#1E5C39",
  accentSoft: "#D6EEDD",
  success: "#2F7A4B",
  successSoft: "#DFF1E5",
  danger: "#B3261E",
  dangerSoft: "#FBE3E0",
  sale: "#C2410C",
  saleSoft: "#FFEDD5",
  skeleton: "#DCEADF",
  overlay: "rgba(15, 35, 22, 0.55)",
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
