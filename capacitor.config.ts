import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ariscbt.com',
  appName: 'ArisCBT',
  webDir: 'out',
  server: {
    url: 'https://ariscbt.vercel.app/',
    cleartext: true
  }
};

export default config;
