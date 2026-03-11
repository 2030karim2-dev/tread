import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { nanoid } from 'nanoid';
import { Note, NoteFormData, NoteType } from '../types';

const STORAGE_KEY = 'trade-navigator-notes';

/**
 * Hook for managing smart notes
 */
export function useNotes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState<NoteType | 'all'>('all');
    const [isLoading, setIsLoading] = useState(true);

    // Load notes from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Validate that parsed data is an array
                if (Array.isArray(parsed)) {
                    setNotes(parsed);
                }
            }
        } catch (error) {
            console.error('Failed to load notes:', error);
            // If parsing fails, start with empty notes
            setNotes([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Save notes to localStorage
    const saveNotes = useCallback((newNotes: Note[]) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotes));
    }, []);

    // Filter notes - memoized to avoid recalculating on every render
    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            const matchesSearch = search === '' ||
                note.title.toLowerCase().includes(search.toLowerCase()) ||
                note.content.toLowerCase().includes(search.toLowerCase()) ||
                note.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));

            const matchesType = filterType === 'all' || note.type === filterType;

            return matchesSearch && matchesType;
        });
    }, [notes, search, filterType]);

    // Add note - uses functional update to avoid stale closure
    const addNote = useCallback((data: NoteFormData) => {
        const now = new Date().toISOString();
        const newNote: Note = {
            id: nanoid(),
            ...data,
            created_at: now,
            updated_at: now,
        };

        setNotes(prevNotes => {
            const updatedNotes = [newNote, ...prevNotes];
            saveNotes(updatedNotes);
            return updatedNotes;
        });

        return newNote;
    }, [saveNotes]);

    // Update note - uses functional update to avoid stale closure
    const updateNote = useCallback((id: string, data: Partial<NoteFormData>) => {
        setNotes(prevNotes => {
            const newNotes = prevNotes.map(note =>
                note.id === id
                    ? { ...note, ...data, updated_at: new Date().toISOString() }
                    : note
            );
            saveNotes(newNotes);
            return newNotes;
        });
    }, [saveNotes]);

    // Delete note - uses functional update to avoid stale closure
    const deleteNote = useCallback((id: string) => {
        setNotes(prevNotes => {
            const newNotes = prevNotes.filter(note => note.id !== id);
            saveNotes(newNotes);
            return newNotes;
        });
    }, [saveNotes]);

    // Get note by ID - uses functional form to get latest notes
    const getNote = useCallback((id: string) => {
        return notes.find(note => note.id === id);
    }, [notes]);

    // Get notes by trip - uses current notes state
    const getNotesByTrip = useCallback((tripId: string) => {
        return notes.filter(note => note.trip_id === tripId);
    }, [notes]);

    // Get notes by supplier - uses current notes state
    const getNotesBySupplier = useCallback((supplierId: string) => {
        return notes.filter(note => note.supplier_id === supplierId);
    }, [notes]);

    // Stats - memoized to avoid recalculating on every render
    const stats = useMemo(() => ({
        total: notes.length,
        text: notes.filter(n => n.type === 'text').length,
        voice: notes.filter(n => n.type === 'voice').length,
        image: notes.filter(n => n.type === 'image').length,
    }), [notes]);

    return {
        notes: filteredNotes,
        allNotes: notes,
        search,
        setSearch,
        filterType,
        setFilterType,
        isLoading,
        addNote,
        updateNote,
        deleteNote,
        getNote,
        getNotesByTrip,
        getNotesBySupplier,
        stats,
    };
}

/**
 * Hook for voice recording
 */
export function useVoiceRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Start recording
    const startRecording = useCallback(async () => {
        try {
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);

            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            // Start timer
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (err) {
            setError('فشل في الوصول للميكروفون. يرجى التحقق من الأذونات.');
            console.error('Recording error:', err);
        }
    }, []);

    // Stop recording
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    }, [isRecording]);

    // Reset recording
    const resetRecording = useCallback(() => {
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }
        setAudioUrl(null);
        setRecordingTime(0);
        setError(null);
    }, [audioUrl]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [audioUrl]);

    return {
        isRecording,
        recordingTime,
        audioUrl,
        error,
        startRecording,
        stopRecording,
        resetRecording,
    };
}

/**
 * Hook for getting location
 */
export function useLocation() {
    const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const getLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setError('المتصفح لا يدعم تحديد الموقع');
            return;
        }

        setIsLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                // Try to get address (reverse geocoding)
                let address: string | undefined;
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                    );
                    if (response.ok) {
                        const data = await response.json();
                        address = data.display_name;
                    }
                } catch {
                    // Ignore geocoding errors - network failure is acceptable
                    console.warn('Geocoding failed, using coordinates only');
                }

                // Build location object with proper typing
                const locationPayload: { lat: number; lng: number; address?: string } = {
                    lat: latitude,
                    lng: longitude,
                };
                if (address) {
                    locationPayload.address = address;
                }
                setLocation(locationPayload);
                setIsLoading(false);
            },
            (err) => {
                setError('فشل في الحصول على الموقع. يرجى التحقق من الأذونات.');
                setIsLoading(false);
                console.error('Location error:', err);
            }
        );
    }, []);

    return { location, error, isLoading, getLocation };
}
