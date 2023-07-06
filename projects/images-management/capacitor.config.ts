import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ines.imagesManagement',
  appName: 'images-management',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
