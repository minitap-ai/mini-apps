import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Croissant",
  slug: "croissant",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "croissant",
  userInterfaceStyle: "light",
  ios: {
    bundleIdentifier: "ai.minitap.croissant",
    supportsTablet: false,
    infoPlist: {
      NSPhotoLibraryUsageDescription: "Croissant uses your photos to decorate a custom cake.",
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: "ai.minitap.croissant",
    adaptiveIcon: {
      backgroundColor: "#F6E7CF",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    permissions: ["android.permission.POST_NOTIFICATIONS"],
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: "single",
    bundler: "metro",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      { backgroundColor: "#FFF8EE", image: "./assets/images/splash-icon.png", imageWidth: 96 },
    ],
    [
      "expo-image-picker",
      { photosPermission: "Croissant uses your photos to decorate a custom cake.", cameraPermission: false },
    ],
    ["expo-notifications", { color: "#B8651B" }],
  ],
  experiments: { typedRoutes: false },
};

export default config;
