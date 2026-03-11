import { FileText } from 'lucide-react';
import { NoteCard } from './NoteCard';
import { NoteType, NoteLocation } from '../types';

interface Note {
    id: string;
    title: string;
    type: NoteType;
    created_at: string;
    location?: NoteLocation;
}

interface NotesListProps {
    notes: Note[];
    onDelete: (id: string) => void;
}

export function NotesList({ notes, onDelete }: NotesListProps) {
    if (notes.length === 0) {
        return (
            <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">لا توجد ملاحظات</h3>
                <p className="text-muted-foreground">
                    أضف ملاحظاتك الأولى للبدء
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 justify-items-center">
            {notes.map((note) => (
                <NoteCard
                    key={note.id}
                    id={note.id}
                    title={note.title}
                    type={note.type}
                    created_at={note.created_at}
                    location={note.location}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
