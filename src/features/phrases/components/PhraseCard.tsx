import { motion } from 'framer-motion';
import { Volume2, VolumeX, Heart, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Phrase } from '../types';
import { usePhrasePlayer } from '../hooks/usePhrases';

interface PhraseCardProps {
    phrase: Phrase;
    onToggleFavorite: (id: string) => void;
}

export function PhraseCard({ phrase, onToggleFavorite }: PhraseCardProps) {
    const [copied, setCopied] = useState(false);
    const { togglePlay, isPlaying, currentId } = usePhrasePlayer();

    const isCurrentlyPlaying = isPlaying && currentId === phrase.id;

    const handleCopy = async () => {
        const text = `${phrase.arabic}\n${phrase.chinese}\n${phrase.pinyin}`;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            // Fallback for HTTP or clipboard access denied
            console.warn('Clipboard write failed:', error);
            // Create a temporary textarea as fallback
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch {
                console.error('Fallback copy failed');
            }
            document.body.removeChild(textarea);
        }
    };

    const handlePlayChinese = () => {
        togglePlay(phrase.chinese, phrase.id);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-24 h-24 sm:w-28 sm:h-28"
        >
            <Card className={cn(
                "group relative overflow-hidden transition-all duration-200 hover:shadow-md h-full",
                isCurrentlyPlaying && "ring-2 ring-primary border-primary"
            )}>
                <CardContent className="p-1.5 h-full flex flex-col justify-between">
                    {/* Arabic Text */}
                    <div>
                        <p className="text-[10px] font-semibold text-foreground leading-tight line-clamp-2">
                            {phrase.arabic}
                        </p>
                    </div>

                    {/* Chinese */}
                    <div>
                        <p className="text-xs font-medium text-primary truncate" dir="ltr">
                            {phrase.chinese}
                        </p>
                        <p className="text-[8px] text-muted-foreground font-mono truncate" dir="ltr">
                            {phrase.pinyin}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-auto">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className={cn(
                                "h-5 w-5 p-0 transition-colors",
                                phrase.isFavorite
                                    ? "text-red-500 hover:text-red-600"
                                    : "text-muted-foreground hover:text-red-500"
                            )}
                            onClick={() => onToggleFavorite(phrase.id)}
                        >
                            <Heart
                                className={cn(
                                    "h-3 w-3",
                                    phrase.isFavorite && "fill-current"
                                )}
                            />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
                            onClick={handlePlayChinese}
                        >
                            {isCurrentlyPlaying ? (
                                <Volume2 className="h-3 w-3 animate-pulse" />
                            ) : (
                                <Volume2 className="h-3 w-3" />
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
