import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, SlidersHorizontal, Volume2 } from 'lucide-react';
import { PageHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { usePhrases, usePhrasePlayer } from '@/features/phrases/hooks/usePhrases';
import { PhraseCard } from '@/features/phrases/components/PhraseCard';
import { PHRASE_CATEGORIES, PhraseCategory } from '@/features/phrases/types';

export default function PhrasesPage() {
    const {
        phrases,
        search,
        setSearch,
        selectedCategory,
        setSelectedCategory,
        favoritesOnly,
        setFavoritesOnly,
        toggleFavorite,
        stats,
    } = usePhrases();

    const { speechRate, setSpeechRate, stop } = usePhrasePlayer();
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="space-y-4">
            <PageHeader
                title="📚 دليل المفاوضة"
            />

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="ابحث في العبارات..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pe-10 text-base h-12"
                    dir="rtl"
                />
            </div>

            {/* Category Tabs */}
            <Tabs
                value={selectedCategory}
                onValueChange={(v) => setSelectedCategory(v as PhraseCategory | 'all')}
                className="w-full"
            >
                <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent p-0">
                    <TabsTrigger
                        value="all"
                        className={cn(
                            "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                            "border px-3 py-1.5 text-sm"
                        )}
                    >
                        الكل ({stats.total})
                    </TabsTrigger>
                    {PHRASE_CATEGORIES.map((cat) => (
                        <TabsTrigger
                            key={cat.id}
                            value={cat.id}
                            className={cn(
                                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                                "border px-3 py-1.5 text-sm"
                            )}
                        >
                            {cat.label.split(' ')[0]} ({stats.byCategory[cat.id]})
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {/* Filters Row */}
            <div className="flex items-center justify-between gap-2">
                <Button
                    variant={favoritesOnly ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFavoritesOnly(!favoritesOnly)}
                    className={cn("gap-2", favoritesOnly && "bg-red-500 hover:bg-red-600")}
                >
                    <Heart className={cn("h-4 w-4", favoritesOnly && "fill-current")} />
                    المفضلة ({stats.favorites})
                </Button>

                <div className="flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">سرعة الصوت:</label>
                    <select
                        value={speechRate}
                        onChange={(e) => setSpeechRate(Number(e.target.value))}
                        className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                    >
                        <option value="0.5">بطيء</option>
                        <option value="0.8">عادي</option>
                        <option value="1">سريع</option>
                    </select>
                </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                    {favoritesOnly ? `عرض ${phrases.length} من المفضلة` : `إظهار ${phrases.length} عبارة`}
                </span>
                {search && (
                    <Badge variant="secondary">
                        بحث: "{search}"
                    </Badge>
                )}
            </div>

            {/* Phrases Grid */}
            <AnimatePresence mode="wait">
                {phrases.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 justify-items-center">
                        {phrases.map((phrase) => (
                            <PhraseCard
                                key={phrase.id}
                                phrase={phrase}
                                onToggleFavorite={toggleFavorite}
                            />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-12 text-center"
                    >
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-lg font-semibold mb-2">لم يتم العثور على نتائج</h3>
                        <p className="text-muted-foreground">
                            حاول تغيير كلمات البحث أو الفئة
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
