import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { LoyalOpsProvider } from '@loyalops/react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { TENANT_PUBLIC_KEY, USER_TOKEN, API_BASE_URL } from '@/constants/config';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <LoyalOpsProvider
        tenantPublicKey={TENANT_PUBLIC_KEY}
        userToken={USER_TOKEN}
        baseUrl={API_BASE_URL}
      >
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </LoyalOpsProvider>
    </ThemeProvider>
  );
}
