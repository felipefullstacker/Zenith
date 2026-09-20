import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Zenith',
  slug: 'zenith',
  version: '1.0.0',
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  },
  plugins: ['expo-font'],
  ios: {
    bundleIdentifier: 'com.felipelima.zenith',
    supportsTablet: true,
  },
  android: {
    package: 'com.felipelima.zenith',
  },
  web: {
    bundler: 'metro',
  },
});
