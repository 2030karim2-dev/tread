import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceRecorderProps {
    isRecording: boolean;
    recordingTime: number;
    audioUrl: string | null;
    error: string | null;
    onStartRecording: () => void;
    onStopRecording: () => void;
    onResetRecording: () => void;
}

export function VoiceRecorder({
    isRecording,
    recordingTime,
    audioUrl,
    error,
    onStartRecording,
    onStopRecording,
    onResetRecording,
}: VoiceRecorderProps) {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg gap-3">
            {isRecording ? (
                <>
                    <div className="flex items-center gap-2 text-red-500">
                        <MicOff className="h-5 w-5 animate-pulse" />
                        <span className="font-mono text-lg">{formatTime(recordingTime)}</span>
                    </div>
                    <Button variant="destructive" onClick={onStopRecording}>
                        إيقاف التسجيل
                    </Button>
                </>
            ) : audioUrl ? (
                <>
                    <audio src={audioUrl} controls className="w-full" />
                    <Button variant="outline" onClick={onResetRecording}>
                        إعادة التسجيل
                    </Button>
                </>
            ) : (
                <>
                    <Mic className="h-8 w-8 text-muted-foreground" />
                    <Button onClick={onStartRecording}>
                        بدء التسجيل
                    </Button>
                </>
            )}
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}
