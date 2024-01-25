import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'ngcap-munin',
  webDir: 'dist/ngcap-munin/browser',
  server: {
    androidScheme: 'https',
  },
  bundledWebRuntime: true,
};

export default config;
