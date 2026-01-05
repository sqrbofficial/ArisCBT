import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ariscbt.com',
  appName: 'ArisCBT',
  webDir: 'out',
  server: {
    url: 'https://your-app-name.vercel.app', // IMPORTANT: Replace with your actual Vercel URL
  }
};

export default config;
