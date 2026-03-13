import { useState } from 'react';
import { Search, Plus, FileText, Image } from 'lucide-react';
import { PageHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNotes, useVoiceRecorder, useLocation } from '@/features/notes/hooks/useNotes';
import { NOTE_TYPE_LABELS, NoteType } from '@/features/notes/types';
import { NotesStats, NotesList, VoiceRecorder, LocationPicker } from '@/features/notes/components';
import { useAppStore } from '@/store/useAppStore';
import { Mic } from 'lucide-react';

export default function NotesPage() {
    const { toast } = useToast();
    const {
        notes, search, setSearch,
        addNote, deleteNote, stats
    } = useNotes();

    const { trips, suppliers } = useAppStore();
    const {
        isRecording, recordingTime, audioUrl, error: recordingError,
        startRecording, stopRecording, resetRecording
    } = useVoiceRecorder();
    const { location, error: locationError, getLocation } = useLocation();

    const [open, setOpen] = useState(false);
    const [noteType, setNoteType] = useState<NoteType>('text');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedTrip, setSelectedTrip] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [noteLocation, setNoteLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null);

    const handleSave = () => {
        if (!title.trim()) {
            toast({ title: 'خطأ', description: 'يرجى إدخال العنوان', variant: 'destructive' });
            return;
        }

        addNote({
            title,
            content,
            type: noteType,
            audio_url: audioUrl || undefined,
            trip_id: selectedTrip || undefined,
            supplier_id: selectedSupplier || undefined,
            tags: [],
            location: noteLocation ?? undefined,
        });

        toast({ title: 'تم الحفظ', description: 'تم إضافة الملاحظة بنجاح' });
        reset();
    };

    const reset = () => {
        setOpen(false);
        setTitle('');
        setContent('');
        setNoteType('text');
        setSelectedTrip('');
        setSelectedSupplier('');
        resetRecording();
        setNoteLocation(null);
    };

    const handleGetLocation = () => {
        getLocation();
    };

    const handleDelete = (id: string) => {
        deleteNote(id);
        toast({ title: 'تم الحذف', description: 'تم حذف الملاحظة' });
    };

    // Update location when hook location changes
    const handleLocationChange = (loc: { lat: number; lng: number; address?: string } | null) => {
        setNoteLocation(loc);
    };

    return (
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            <PageHeader
                title="📝 الملاحظات الذكية"
            />

            {/* Stats */}
            <NotesStats
                total={stats.total}
                text={stats.text}
                voice={stats.voice}
                image={stats.image}
            />

            {/* Search */}
            <div className="relative">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="ابحث في الملاحظات..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pe-10"
                />
            </div>

            {/* Add Note Button */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="w-full gap-2" size="lg">
                        <Plus className="h-5 w-5" />
                        إضافة ملاحظة جديدة
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>إضافة ملاحظة جديدة</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Note Type Selection */}
                        <div className="flex gap-2">
                            {(Object.keys(NOTE_TYPE_LABELS) as NoteType[]).map((type) => (
                                <Button
                                    key={type}
                                    variant={noteType === type ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setNoteType(type)}
                                    className="flex-1 gap-1"
                                >
                                    {type === 'text' && <FileText className="h-4 w-4" />}
                                    {type === 'voice' && <Mic className="h-4 w-4" />}
                                    {type === 'image' && <Image className="h-4 w-4" />}
                                    {NOTE_TYPE_LABELS[type].label}
                                </Button>
                            ))}
                        </div>

                        {/* Title */}
                        <div>
                            <Label>العنوان</Label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="أدخل عنوان الملاحظة"
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <Label>المحتوى</Label>
                            {noteType === 'text' ? (
                                <Textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="اكتب ملاحظتك..."
                                    rows={4}
                                />
                            ) : noteType === 'voice' ? (
                                <VoiceRecorder
                                    isRecording={isRecording}
                                    recordingTime={recordingTime}
                                    audioUrl={audioUrl}
                                    error={recordingError}
                                    onStartRecording={startRecording}
                                    onStopRecording={stopRecording}
                                    onResetRecording={resetRecording}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg">
                                    <Image className="h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">سيتم إضافة ميزة رفع الصور قريباً</p>
                                </div>
                            )}
                        </div>

                        {/* Trip & Supplier Selection */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label>الرحلة (اختياري)</Label>
                                <select
                                    value={selectedTrip}
                                    onChange={(e) => setSelectedTrip(e.target.value)}
                                    className="w-full h-10 rounded-md border border-input bg-background px-3"
                                >
                                    <option value="">اختر رحلة</option>
                                    {trips.map(trip => (
                                        <option key={trip.id} value={trip.id}>{trip.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <Label>المورد (اختياري)</Label>
                                <select
                                    value={selectedSupplier}
                                    onChange={(e) => setSelectedSupplier(e.target.value)}
                                    className="w-full h-10 rounded-md border border-input bg-background px-3"
                                >
                                    <option value="">اختر مورد</option>
                                    {suppliers.map(supplier => (
                                        <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <Label>الموقع (اختياري)</Label>
                            <LocationPicker
                                location={noteLocation}
                                error={locationError}
                                onGetLocation={handleGetLocation}
                                onClearLocation={() => handleLocationChange(null)}
                            />
                        </div>

                        {/* Save Button */}
                        <Button onClick={handleSave} className="w-full" size="lg">
                            حفظ الملاحظة
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Notes List */}
            <NotesList
                notes={notes}
                onDelete={handleDelete}
            />
        </div>
    );
}
