import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts as useInterFonts,
} from '@expo-google-fonts/inter';
import {
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts as usePoppinsFonts,
} from '@expo-google-fonts/poppins';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColors } from '@/hooks/useColors';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const colors = useColors();
  return (
    <Stack
      screenOptions={{
        headerBackTitle: 'Back',
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontFamily: 'Poppins_600SemiBold', fontSize: 16 },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="career/[id]"
        options={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: '#ffffff' },
        }}
      />
      <Stack.Screen
        name="domain/[id]"
        options={{
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: '#ffffff' },
        }}
      />
      <Stack.Screen
        name="roadmap/[id]"
        options={{
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: '#ffffff' },
        }}
      />
      <Stack.Screen
        name="exam/[id]"
        options={{
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: '#ffffff' },
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [interLoaded, interError] = useInterFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [poppinsLoaded, poppinsError] = usePoppinsFonts({
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const fontsLoaded = interLoaded && poppinsLoaded;
  const fontError = interError ?? poppinsError;

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <RootLayoutNav />
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
