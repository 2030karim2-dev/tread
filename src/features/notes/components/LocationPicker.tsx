import { MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NoteLocation } from '../types';

interface LocationPickerProps {
    location: NoteLocation | null;
    error: string | null;
    onGetLocation: () => void;
    onClearLocation: () => void;
}

export function LocationPicker({
    location,
    error,
    onGetLocation,
    onClearLocation,
}: LocationPickerProps) {
    return (
        <div>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    onClick={onGetLocation}
                    disabled={location?.lat !== undefined}
                    className="flex-1 gap-2"
                >
                    <MapPin className="h-4 w-4" />
                    {location?.lat ? 'تم تحديد الموقع' : 'تحديد الموقع'}
                </Button>
                {location?.lat && (
                    <Button variant="ghost" onClick={onClearLocation}>
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
            {location?.address && (
                <p className="text-xs text-muted-foreground mt-1">{location.address}</p>
            )}
            {error && (
                <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
}
