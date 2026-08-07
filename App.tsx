import React from 'react';
import { Text, TextInput, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import { AuthProvider } from './src/auth/AuthContext';
import { initSentry } from './src/lib/sentry';
import { useAppUpdates } from './src/hooks/useAppUpdates';

// ─── Global: Font scaling devre dışı ─────────────────────────────────────────
if (!(Text as any).defaultProps) (Text as any).defaultProps = {};
(Text as any).defaultProps.allowFontScaling = false;
if (!(TextInput as any).defaultProps) (TextInput as any).defaultProps = {};
(TextInput as any).defaultProps.allowFontScaling = false;

// ─── Sentry — module level (component tree'den önce) ─────────────────────────
initSentry();

// ─── React Query Client ───────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
      retry: 2,
      retryDelay: attempt => Math.min(1000 * 2 ** attempt, 15_000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: { retry: 1 },
  },
});

// ─── OTA + Navigation root ────────────────────────────────────────────────────
function AppRoot() {
  useAppUpdates(); // EAS build'lerde OTA güncelleme kontrolü
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

// ─── App Entry ────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <AuthProvider>
            <StatusBar
              barStyle="dark-content"
              backgroundColor="transparent"
              translucent={true}
            />
            <AppRoot />
          </AuthProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
