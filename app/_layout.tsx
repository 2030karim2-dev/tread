// Root Layout - China Trade Assistant Pro

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppStore } from '../src/stores/appStore';
import { getDatabase } from '../src/core/database';
import { useOffline } from '../src/hooks/useOffline';

function OfflineIndicator() {
    const isOffline = useOffline();

    if (!isOffline) return null;

    return (
        <View style={{
            backgroundColor: '#ef4444',
            padding: 8,
            alignItems: 'center'
        }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
                📴 أنت غير متصل - يعمل في وضع عدم الاتصال
            </Text>
        </View>
    );
}

function LoadingScreen() {
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#1e40af'
        }}>
            <ActivityIndicator size="large" color="white" />
            <Text style={{ color: 'white', marginTop: 16, fontSize: 18 }}>
                جاري التحميل...
            </Text>
        </View>
    );
}

export default function RootLayout() {
    const isLoading = useAppStore((state) => state.isLoading);
    const setLoading = useAppStore((state) => state.setLoading);

    useEffect(() => {
        async function initializeApp() {
            try {
                // Initialize database
                await getDatabase();
                // Add any additional initialization here
            } catch (error) {
                console.error('Failed to initialize app:', error);
            } finally {
                setLoading(false);
            }
        }

        initializeApp();
    }, [setLoading]);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <SafeAreaProvider>
            <OfflineIndicator />
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
                <Stack.Screen
                    name="note/[id]"
                    options={{
                        title: 'تفاصيل الملاحظة',
                        presentation: 'card'
                    }}
                />
            </Stack>
        </SafeAreaProvider>
    );
}
