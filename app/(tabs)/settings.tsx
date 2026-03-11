// Settings Screen - China Trade Assistant Pro

import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView } from 'react-native';
import { useState } from 'react';

interface SettingItemProps {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
}

function SettingItem({ icon, title, subtitle, onPress, rightElement }: SettingItemProps) {
    return (
        <TouchableOpacity
            style={styles.settingItem}
            onPress={onPress}
            disabled={!onPress}
        >
            <Text style={styles.settingIcon}>{icon}</Text>
            <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{title}</Text>
                {subtitle ? (
                    <Text style={styles.settingSubtitle}>{subtitle}</Text>
                ) : null}
            </View>
            {rightElement}
        </TouchableOpacity>
    );
}

function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionContent}>
                {children}
            </View>
        </View>
    );
}

export default function SettingsScreen() {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [offlineSync, setOfflineSync] = useState(true);

    return (
        <ScrollView style={styles.container}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>👤</Text>
                </View>
                <Text style={styles.userName}>التاجر</Text>
                <Text style={styles.userEmail}> trader@chinatrade.app</Text>
            </View>

            {/* General Settings */}
            <SettingSection title="عام">
                <SettingItem
                    icon="🎨"
                    title="المظهر"
                    subtitle={darkMode ? 'داكن' : 'فاتح'}
                    rightElement={
                        <Switch
                            value={darkMode}
                            onValueChange={setDarkMode}
                            trackColor={{ false: '#e2e8f0', true: '#3b82f6' }}
                        />
                    }
                />
                <SettingItem
                    icon="🔔"
                    title="الإشعارات"
                    subtitle={notifications ? 'مفعّل' : 'معطّل'}
                    rightElement={
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                            trackColor={{ false: '#e2e8f0', true: '#3b82f6' }}
                        />
                    }
                />
                <SettingItem
                    icon="🔄"
                    title="مزامنة تلقائية"
                    subtitle={offlineSync ? 'مفعّل' : 'معطّل'}
                    rightElement={
                        <Switch
                            value={offlineSync}
                            onValueChange={setOfflineSync}
                            trackColor={{ false: '#e2e8f0', true: '#3b82f6' }}
                        />
                    }
                />
            </SettingSection>

            {/* Data Management */}
            <SettingSection title="إدارة البيانات">
                <SettingItem
                    icon="📤"
                    title="تصدير البيانات"
                    subtitle="تصدير جميع البيانات إلى JSON"
                />
                <SettingItem
                    icon="📥"
                    title="استيراد البيانات"
                    subtitle="استيراد بيانات من ملف"
                />
                <SettingItem
                    icon="🗑️"
                    title="مسح البيانات"
                    subtitle="حذف جميع البيانات المحلية"
                />
            </SettingSection>

            {/* Language & Translation */}
            <SettingSection title="اللغة والترجمة">
                <SettingItem
                    icon="🌐"
                    title="لغة الواجهة"
                    subtitle="العربية"
                />
                <SettingItem
                    icon="🔤"
                    title="خط النص Chino"
                    subtitle="تفعيل النص الصيني"
                />
            </SettingSection>

            {/* Security */}
            <SettingSection title="الأمان">
                <SettingItem
                    icon="🔐"
                    title="قفل التطبيق"
                    subtitle="بصمة أو Face ID"
                />
                <SettingItem
                    icon="🔒"
                    title="تشفير البيانات"
                    subtitle="تشفير البيانات المحلية"
                />
            </SettingSection>

            {/* About */}
            <SettingSection title="حول">
                <SettingItem
                    icon="ℹ️"
                    title="الإصدار"
                    subtitle="1.0.0"
                />
                <SettingItem
                    icon="📋"
                    title="الشروط والأحكام"
                />
                <SettingItem
                    icon="🔒"
                    title="الخصوصية"
                />
            </SettingSection>

            <Text style={styles.footer}>
                China Trade Assistant Pro © 2026
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    profileSection: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#1e40af',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 36,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 12,
    },
    userEmail: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 4,
    },
    section: {
        marginTop: 24,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    sectionContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    settingIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1e293b',
    },
    settingSubtitle: {
        fontSize: 13,
        color: '#64748b',
        marginTop: 2,
    },
    footer: {
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: 12,
        marginTop: 32,
        marginBottom: 48,
    },
});
