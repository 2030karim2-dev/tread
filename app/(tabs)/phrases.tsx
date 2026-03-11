// Phrases Screen - China Trade Assistant Pro

import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppStore } from '../../src/stores/appStore';
import { Phrase } from '../../src/types/database';
import * as Speech from 'expo-speech';

function PhraseCard({ phrase, onSpeak }: { phrase: Phrase; onSpeak: (text: string) => void }) {
    return (
        <TouchableOpacity
            style={styles.phraseCard}
            onPress={() => onSpeak(phrase.chinese)}
        >
            <View style={styles.phraseHeader}>
                <Text style={styles.chineseText}>{phrase.chinese}</Text>
                {phrase.is_favorite ? (
                    <Text style={styles.favoriteIcon}>⭐</Text>
                ) : null}
            </View>
            <Text style={styles.pinyinText}>{phrase.pinyin}</Text>
            <Text style={styles.arabicText}>{phrase.arabic}</Text>
            <View style={styles.phraseFooter}>
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{phrase.category}</Text>
                </View>
                <Text style={styles.usageCount}> использова: {phrase.usage_count}</Text>
            </View>
        </TouchableOpacity>
    );
}

export default function PhrasesScreen() {
    const phrases = useAppStore((state) => state.phrases);
    const toggleFavorite = useAppStore((state) => state.toggleFavoritePhrase);

    const handleSpeak = (text: string) => {
        Speech.speak(text, {
            language: 'zh-CN',
            pitch: 1.0,
            rate: 0.8,
        });
    };

    if (phrases.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>💬</Text>
                <Text style={styles.emptyTitle}>لا توجد عبارات</Text>
                <Text style={styles.emptySubtitle}>
                    قائمة العبارات الصينية المفيدة
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={phrases}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <PhraseCard phrase={item} onSpeak={handleSpeak} />
                )}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
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
    phraseCard: {
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
    phraseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chineseText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ef4444',
    },
    favoriteIcon: {
        fontSize: 18,
    },
    pinyinText: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 4,
        fontStyle: 'italic',
    },
    arabicText: {
        fontSize: 16,
        color: '#1e293b',
        marginTop: 8,
        fontWeight: '500',
    },
    phraseFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    categoryBadge: {
        backgroundColor: '#e0f2fe',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    categoryText: {
        fontSize: 12,
        color: '#0284c7',
        fontWeight: '500',
    },
    usageCount: {
        fontSize: 12,
        color: '#94a3b8',
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
});
