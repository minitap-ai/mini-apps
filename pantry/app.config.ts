import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Pantry",
  slug: "pantry",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "pantry",
  userInterfaceStyle: "light",
  ios: {
    bundleIdentifier: "ai.minitap.pantry",
    supportsTablet: false,
    infoPlist: {
      NSLocationWhenInUseUsageDescription: "Pantry uses your location to fill in your delivery address.",
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: "ai.minitap.pantry",
    adaptiveIcon: {
      backgroundColor: "#2E7D50",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    permissions: ["android.permission.POST_NOTIFICATIONS", "android.permission.ACCESS_COARSE_LOCATION"],
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: "single",
    bundler: "metro",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    ["expo-splash-screen", { backgroundColor: "#F3FAF5", image: "./assets/images/splash-icon.png", imageWidth: 96 }],
    ["expo-notifications", { color: "#2E7D50" }],
    ["expo-location", { locationWhenInUsePermission: "Pantry uses your location to fill in your delivery address." }],
  ],
  experiments: { typedRoutes: false },
};

export default config;
