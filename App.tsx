// Main Entry Point - China Trade Assistant Pro

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppStore } from './src/stores/appStore';
import { getDatabase } from './src/core/database';

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#1e40af" />
      <Text style={styles.loadingText}>جاري التحميل...</Text>
    </View>
  );
}

export default function App() {
  const isLoading = useAppStore((state) => state.isLoading);
  const setLoading = useAppStore((state) => state.setLoading);

  useEffect(() => {
    async function initApp() {
      try {
        // Initialize database
        await getDatabase();

        // Add default phrases if needed
        // await seedDefaultPhrases();
      } catch (error) {
        console.error('Failed to initialize:', error);
      } finally {
        setLoading(false);
      }
    }

    initApp();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <LoadingScreen />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1e40af',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="trip/[id]"
          options={{
            title: 'تفاصيل الرحلة',
            presentation: 'card'
          }}
        />
        <Stack.Screen
          name="supplier/[id]"
          options={{
            title: 'تفاصيل المورد',
            presentation: 'card'
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
});
