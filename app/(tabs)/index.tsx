// Dashboard Screen - China Trade Assistant Pro

import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppStore } from '../../src/stores/appStore';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: string;
    color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
    return (
        <View style={[styles.statCard, { borderLeftColor: color }]}>
            <Text style={styles.statIcon}>{icon}</Text>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statTitle}>{title}</Text>
        </View>
    );
}

export default function DashboardScreen() {
    const { trips, products, suppliers, shipments, expenses, notes } = useAppStore();

    const activeTrips = trips.filter(t => t.status === 'in_progress').length;
    const totalProducts = products.length;
    const totalSuppliers = suppliers.length;
    const inTransitShipments = shipments.filter(s => s.status === 'in_transit').length;

    return (
        <ScrollView style={styles.container}>
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
                <Text style={styles.welcomeText}>مرحباً بك 👋</Text>
                <Text style={styles.appTitle}>مساعد الاستيراد من الصين</Text>
                <Text style={styles.welcomeSubtitle}>
                    تتبع رحلاتك ومشترياتك في مكان واحد
                </Text>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
                <StatCard
                    title="الرحلات النشطة"
                    value={activeTrips}
                    icon="✈️"
                    color="#3b82f6"
                />
                <StatCard
                    title="المنتجات"
                    value={totalProducts}
                    icon="📦"
                    color="#10b981"
                />
                <StatCard
                    title="الموردين"
                    value={totalSuppliers}
                    icon="🏭"
                    color="#f59e0b"
                />
                <StatCard
                    title="الشحنات"
                    value={inTransitShipments}
                    icon="🚢"
                    color="#8b5cf6"
                />
            </View>

            {/* Quick Actions */}
            <Text style={styles.sectionTitle}>إجراءات سريعة</Text>
            <View style={styles.quickActions}>
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>➕</Text>
                    <Text style={styles.actionText}>رحلة جديدة</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>📝</Text>
                    <Text style={styles.actionText}>إضافة منتج</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>🎤</Text>
                    <Text style={styles.actionText}>ملاحظة صوتية</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>💬</Text>
                    <Text style={styles.actionText}>ترجمة</Text>
                </TouchableOpacity>
            </View>

            {/* Recent Activity Placeholder */}
            <Text style={styles.sectionTitle}>النشاط الأخير</Text>
            <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📋</Text>
                <Text style={styles.emptyText}>لا يوجد نشاط حديث</Text>
                <Text style={styles.emptySubtext}>
                    ابدأ بإضافة رحلة أو منتج جديد
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    welcomeSection: {
        backgroundColor: '#1e40af',
        padding: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    welcomeText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 16,
    },
    appTitle: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 4,
    },
    welcomeSubtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        marginTop: 8,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
        gap: 12,
    },
    statCard: {
        width: '47%',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    statTitle: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e293b',
        paddingHorizontal: 16,
        marginTop: 24,
        marginBottom: 12,
    },
    quickActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        gap: 12,
    },
    actionButton: {
        width: '47%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    actionIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
    },
    emptyState: {
        backgroundColor: 'white',
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#334155',
    },
    emptySubtext: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 4,
    },
});
