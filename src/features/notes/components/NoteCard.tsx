import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { NoteType } from '../types';

interface NoteCardProps {
    id: string;
    title: string;
    type: NoteType;
    created_at: string;
    location?: { lat: number; lng: number; address?: string };
    onDelete: (id: string) => void;
}

export function NoteCard({ id, title, type, created_at, location, onDelete }: NoteCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-24 h-24 sm:w-28 sm:h-28"
        >
            <Card className="overflow-hidden h-full">
                <CardContent className="p-1.5 h-full flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-1 mb-1">
                            <Badge variant="outline" className="text-[8px] px-1 py-0">
                                {type === 'text' && '📝'}
                                {type === 'voice' && '🎤'}
                                {type === 'image' && '🖼️'}
                            </Badge>
                            {location && (
                                <Badge variant="secondary" className="text-[8px] px-1 py-0">
                                    📍
                                </Badge>
                            )}
                        </div>
                        <h3 className="font-semibold text-[10px] line-clamp-2">{title}</h3>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                        <span className="text-[8px] text-muted-foreground">
                            {new Date(created_at).toLocaleDateString('ar-SA')}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => onDelete(id)}
                            className="h-5 w-5"
                        >
                            <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
