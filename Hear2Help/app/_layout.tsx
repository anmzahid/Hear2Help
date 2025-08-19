import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { SocketProvider } from '@/contexts/SocketContext';
import { SoundPreferencesProvider } from '@/contexts/SoundPreferencesContext';
import { SettingsProvider, useSettings } from '@/contexts/SettingsContext';

const HighContrastTheme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: '#FFD700',
    background: '#000000',
    card: '#000000',
    text: '#FFFFFF',
    border: '#FFFFFF',
    notification: '#FF0000',
  },
};

function ThemedProviders({ children }: { children: React.ReactNode }) {
  const { appearance } = useSettings();
  const theme = appearance === 'high-contrast' ? HighContrastTheme : (appearance === 'dark' ? DarkTheme : DefaultTheme);
  return (
    <ThemeProvider value={theme}>
      {children}
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SettingsProvider>
      <ThemedProviders>
        <SoundPreferencesProvider>
          <SocketProvider>
            <Stack>
              <Stack.Screen name="OnboardingScreen" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </SocketProvider>
        </SoundPreferencesProvider>
      </ThemedProviders>
    </SettingsProvider>
  );
}
