// Tabs Layout - China Trade Assistant Pro

import { Tabs } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
    const icons: Record<string, string> = {
        index: '🏠',
        trips: '✈️',
        products: '📦',
        notes: '📝',
        phrases: '💬',
        settings: '⚙️',
    };

    return (
        <View style={styles.iconContainer}>
            <Text style={[styles.icon, focused && styles.iconFocused]}>
                {icons[name] || '📄'}
            </Text>
        </View>
    );
}

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#1e40af',
                tabBarInactiveTintColor: '#64748b',
                tabBarStyle: {
                    backgroundColor: 'white',
                    borderTopWidth: 1,
                    borderTopColor: '#e2e8f0',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
                headerStyle: {
                    backgroundColor: '#1e40af',
                },
                headerTintColor: 'white',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'الرئيسية',
                    tabBarIcon: ({ focused }) => <TabIcon name="index" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="trips"
                options={{
                    title: 'الرحلات',
                    tabBarIcon: ({ focused }) => <TabIcon name="trips" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="products"
                options={{
                    title: 'المنتجات',
                    tabBarIcon: ({ focused }) => <TabIcon name="products" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="notes"
                options={{
                    title: 'الملاحظات',
                    tabBarIcon: ({ focused }) => <TabIcon name="notes" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="phrases"
                options={{
                    title: 'العبارات',
                    tabBarIcon: ({ focused }) => <TabIcon name="phrases" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'الإعدادات',
                    tabBarIcon: ({ focused }) => <TabIcon name="settings" focused={focused} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        fontSize: 20,
        opacity: 0.7,
    },
    iconFocused: {
        opacity: 1,
    },
});
