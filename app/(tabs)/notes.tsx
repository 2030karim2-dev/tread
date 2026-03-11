// Notes Screen - China Trade Assistant Pro

import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppStore } from '../../src/stores/appStore';
import { Note } from '../../src/types/database';

const TYPE_ICONS: Record<string, string> = {
    text: '📝',
    voice: '🎤',
    image: '🖼️',
};

function NoteCard({ note }: { note: Note }) {
    const icon = TYPE_ICONS[note.type] || '📝';

    return (
        <TouchableOpacity style={styles.noteCard}>
            <View style={styles.noteHeader}>
                <Text style={styles.noteIcon}>{icon}</Text>
                <Text style={styles.noteDate}>
                    {new Date(note.created_at).toLocaleDateString('ar-SA')}
                </Text>
            </View>
            <Text style={styles.noteTitle} numberOfLines={1}>{note.title}</Text>
            {note.content ? (
                <Text style={styles.noteContent} numberOfLines={2}>{note.content}</Text>
            ) : null}
            {note.location_address ? (
                <View style={styles.locationRow}>
                    <Text style={styles.locationIcon}>📍</Text>
                    <Text style={styles.locationText} numberOfLines={1}>
                        {note.location_address}
                    </Text>
                </View>
            ) : null}
        </TouchableOpacity>
    );
}

export default function NotesScreen() {
    const notes = useAppStore((state) => state.notes);

    if (notes.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📝</Text>
                <Text style={styles.emptyTitle}>لا توجد ملاحظات</Text>
                <Text style={styles.emptySubtitle}>
                    أضف ملاحظات نصية أو صوتية
                </Text>
                <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addButtonText}>➕ إضافة ملاحظة</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={notes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <NoteCard note={item} />}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                columnWrapperStyle={styles.row}
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
    row: {
        gap: 12,
        marginBottom: 12,
    },
    noteCard: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        minHeight: 120,
    },
    noteHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    noteIcon: {
        fontSize: 20,
    },
    noteDate: {
        fontSize: 10,
        color: '#94a3b8',
    },
    noteTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    noteContent: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    locationIcon: {
        fontSize: 10,
    },
    locationText: {
        fontSize: 10,
        color: '#64748b',
        marginLeft: 4,
        flex: 1,
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
