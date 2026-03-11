import { useState, useMemo, useCallback } from 'react';
import { phrases as defaultPhrases } from '../data/phrases';
import { Phrase, PhraseCategory } from '../types';

/**
 * Hook for managing negotiation phrases
 */
export function usePhrases() {
    const [phrases, setPhrases] = useState<Phrase[]>(defaultPhrases);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<PhraseCategory | 'all'>('all');
    const [favoritesOnly, setFavoritesOnly] = useState(false);

    // Filter phrases based on search and category
    const filteredPhrases = useMemo(() => {
        return phrases.filter(phrase => {
            const matchesSearch = search === '' ||
                phrase.arabic.toLowerCase().includes(search.toLowerCase()) ||
                phrase.chinese.includes(search) ||
                phrase.pinyin.toLowerCase().includes(search.toLowerCase());

            const matchesCategory = selectedCategory === 'all' || phrase.category === selectedCategory;
            const matchesFavorite = !favoritesOnly || phrase.isFavorite;

            return matchesSearch && matchesCategory && matchesFavorite;
        });
    }, [phrases, search, selectedCategory, favoritesOnly]);

    // Toggle favorite
    const toggleFavorite = useCallback((id: string) => {
        setPhrases(prev => prev.map(phrase =>
            phrase.id === id
                ? { ...phrase, isFavorite: !phrase.isFavorite }
                : phrase
        ));
    }, []);

    // Get phrases by category
    const getByCategory = useCallback((category: PhraseCategory) => {
        return phrases.filter(p => p.category === category);
    }, [phrases]);

    // Get favorite phrases
    const favorites = useMemo(() => {
        return phrases.filter(p => p.isFavorite);
    }, [phrases]);

    // Stats
    const stats = useMemo(() => ({
        total: phrases.length,
        favorites: favorites.length,
        byCategory: {
            greetings: phrases.filter(p => p.category === 'greetings').length,
            bargaining: phrases.filter(p => p.category === 'bargaining').length,
            quantities: phrases.filter(p => p.category === 'quantities').length,
            payment: phrases.filter(p => p.category === 'payment').length,
            quality: phrases.filter(p => p.category === 'quality').length,
            closing: phrases.filter(p => p.category === 'closing').length,
        }
    }), [phrases, favorites]);

    return {
        phrases: filteredPhrases,
        allPhrases: phrases,
        search,
        setSearch,
        selectedCategory,
        setSelectedCategory,
        favoritesOnly,
        setFavoritesOnly,
        toggleFavorite,
        getByCategory,
        favorites,
        stats,
    };
}

/**
 * Hook for text-to-speech playback
 */
export function usePhrasePlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [speechRate, setSpeechRate] = useState(0.8);

    // Speak text using Web Speech API
    const speak = useCallback((text: string, id: string) => {
        // Stop any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN'; // Chinese
        utterance.rate = speechRate;

        utterance.onstart = () => {
            setIsPlaying(true);
            setCurrentId(id);
        };

        utterance.onend = () => {
            setIsPlaying(false);
            setCurrentId(null);
        };

        utterance.onerror = () => {
            setIsPlaying(false);
            setCurrentId(null);
        };

        window.speechSynthesis.speak(utterance);
    }, [speechRate]);

    // Stop current speech
    const stop = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setCurrentId(null);
    }, []);

    // Toggle play/pause
    const togglePlay = useCallback((text: string, id: string) => {
        if (isPlaying && currentId === id) {
            stop();
        } else {
            speak(text, id);
        }
    }, [isPlaying, currentId, speak, stop]);

    return {
        isPlaying,
        currentId,
        speechRate,
        setSpeechRate,
        speak,
        stop,
        togglePlay,
    };
}
