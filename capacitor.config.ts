import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ariscbt.com',
  appName: 'ArisCBT',
  webDir: 'out',
  server: {
    url: 'http://192.168.1.100:9002', // Change this to your computer's local IP address
    cleartext: true
  }
};

export default config;
