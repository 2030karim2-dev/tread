import { Card, CardContent } from '@/components/ui/card';

interface NotesStatsProps {
    total: number;
    text: number;
    voice: number;
    image: number;
}

export function NotesStats({ total, text, voice, image }: NotesStatsProps) {
    return (
        <div className="grid grid-cols-4 gap-2">
            <Card className="bg-blue-50 dark:bg-blue-950">
                <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{total}</div>
                    <div className="text-xs text-blue-600">الإجمالي</div>
                </CardContent>
            </Card>
            <Card className="bg-green-50 dark:bg-green-950">
                <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">{text}</div>
                    <div className="text-xs text-green-600">نصية</div>
                </CardContent>
            </Card>
            <Card className="bg-red-50 dark:bg-red-950">
                <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold text-red-600">{voice}</div>
                    <div className="text-xs text-red-600">صوتية</div>
                </CardContent>
            </Card>
            <Card className="bg-purple-50 dark:bg-purple-950">
                <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold text-purple-600">{image}</div>
                    <div className="text-xs text-purple-600">صور</div>
                </CardContent>
            </Card>
        </div>
    );
}
