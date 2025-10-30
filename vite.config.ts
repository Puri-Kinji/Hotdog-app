import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.earles.crenshaw',
  appName: "Earle's on Crenshaw",
  webDir: 'dist', // folder Vite will build into
  server: {
    androidScheme: 'https'
  }
};

export default config;
