// Smart Notes types

export type NoteType = 'text' | 'voice' | 'image';

export interface NoteLocation {
    lat: number;
    lng: number;
    address?: string;
}

export interface Note {
    id: string;
    title: string;
    content: string;
    type: NoteType;
    audio_url?: string;
    audio_duration?: number;
    image_url?: string;
    image_thumbnail?: string;
    location?: NoteLocation;
    trip_id?: string;
    supplier_id?: string;
    tags: string[];
    created_at: string;
    updated_at: string;
}

export interface NoteFormData {
    title: string;
    content: string;
    type: NoteType;
    audio_url?: string;
    trip_id?: string;
    supplier_id?: string;
    tags: string[];
    location?: NoteLocation;
}

export const NOTE_TYPE_LABELS: Record<NoteType, { label: string; icon: string }> = {
    text: { label: 'ملاحظة نصية', icon: 'FileText' },
    voice: { label: 'ملاحظة صوتية', icon: 'Mic' },
    image: { label: 'صورة', icon: 'Image' },
};

export const NOTE_TYPE_COLORS: Record<NoteType, string> = {
    text: 'bg-blue-500',
    voice: 'bg-red-500',
    image: 'bg-green-500',
};
