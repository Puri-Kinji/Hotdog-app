import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.earlesoncrenshaw.app',
  appName: "Earle's on Crenshaw",
  webDir: 'dist',
  ios: {
    contentInset: 'automatic',
  },
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  }
};

export default config;
