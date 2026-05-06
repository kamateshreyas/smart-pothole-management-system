// frontend/capacitor.config.ts
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.roadiq.app",
  appName: "RoadIQ",
  webDir: "dist",
  server: {
    androidScheme: "https"
  }
};

export default config;