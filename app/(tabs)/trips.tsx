// Trips Screen - China Trade Assistant Pro

import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppStore } from '../../src/stores/appStore';
import { Trip } from '../../src/types/database';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    planned: { label: 'مخطط', color: '#3b82f6' },
    in_progress: { label: 'قيد التنفيذ', color: '#f59e0b' },
    completed: { label: 'مكتمل', color: '#10b981' },
    cancelled: { label: 'ملغي', color: '#ef4444' },
};

function TripCard({ trip }: { trip: Trip }) {
    const status = STATUS_LABELS[trip.status] || STATUS_LABELS.planned;

    return (
        <TouchableOpacity style={styles.tripCard}>
            <View style={styles.tripHeader}>
                <Text style={styles.tripName}>{trip.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
                    <Text style={styles.statusText}>{status.label}</Text>
                </View>
            </View>
            <Text style={styles.tripCity}>📍 {trip.city}</Text>
            <View style={styles.tripDates}>
                <Text style={styles.dateText}>
                    📅 {trip.start_date} - {trip.end_date || 'ongoing'}
                </Text>
            </View>
            {trip.notes ? (
                <Text style={styles.tripNotes} numberOfLines={2}>{trip.notes}</Text>
            ) : null}
        </TouchableOpacity>
    );
}

export default function TripsScreen() {
    const trips = useAppStore((state) => state.trips);

    if (trips.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>✈️</Text>
                <Text style={styles.emptyTitle}>لا توجد رحلات</Text>
                <Text style={styles.emptySubtitle}>
                    أضف رحلتك الأولى إلى الصين
                </Text>
                <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addButtonText}>➕ إضافة رحلة</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={trips}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <TripCard trip={item} />}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity style={styles.fab}>
                <Text style={styles.fabText}>➕</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    list: {
        padding: 16,
    },
    tripCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    tripHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    tripName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    tripCity: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 4,
    },
    tripDates: {
        marginTop: 4,
    },
    dateText: {
        fontSize: 12,
        color: '#94a3b8',
    },
    tripNotes: {
        fontSize: 13,
        color: '#64748b',
        marginTop: 8,
        fontStyle: 'italic',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 8,
        textAlign: 'center',
    },
    addButton: {
        marginTop: 24,
        backgroundColor: '#1e40af',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    addButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#1e40af',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#1e40af',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    fabText: {
        fontSize: 24,
        color: 'white',
    },
});
