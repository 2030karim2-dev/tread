import { useState, useMemo } from 'react';
import { MapPin, Star, ExternalLink } from 'lucide-react';
import { PageHeader, SearchBar, EmptyState } from '@/components/shared';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data until API is integrated
const MOCK_ACCOMMODATIONS = [
  {
    id: '1',
    name: 'فندق كانتون (Canton Hotel)',
    city: 'كوانزو (Guangzhou)',
    distance: '0.5 كم من سوق الجملة',
    pricePerNight: 350,
    currency: 'CNY',
    rating: 4.8,
    reviewsCount: 124,
    features: ['إفطار حلال', 'قريب من السوق', 'يتحدثون الإنجليزية'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop',
    type: 'فندق 4 نجوم'
  },
  {
    id: '2',
    name: 'شقق إيوو الفندقية (Yiwu Suites)',
    city: 'إيوو (Yiwu)',
    distance: '1.2 كم من سوق الفوتيان',
    pricePerNight: 200,
    currency: 'CNY',
    rating: 4.5,
    reviewsCount: 89,
    features: ['مطبخ صغير', 'غسالة ملابس', 'سعر اقتصادي'],
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop',
    type: 'شقق مفروشة'
  },
  {
    id: '3',
    name: 'فندق شينزين بيزنس',
    city: 'شينزين (Shenzhen)',
    distance: '2.0 كم من هواكيانج بي (سوق الإلكترونيات)',
    pricePerNight: 450,
    currency: 'CNY',
    rating: 4.2,
    reviewsCount: 56,
    features: ['إنترنت سريع', 'قاعة اجتماعات', 'مركز أعمال'],
    image: 'https://images.unsplash.com/photo-1551882547-ff40c0d13c11?w=500&h=300&fit=crop',
    type: 'فندق 5 نجوم'
  }
];

export default function AccommodationPage() {
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');

  const filteredAccommodations = useMemo(() => {
    return MOCK_ACCOMMODATIONS.filter(acc => {
      const matchesSearch = search === '' || acc.name.toLowerCase().includes(search.toLowerCase());
      const matchesCity = cityFilter === 'all' || acc.city.includes(cityFilter);
      return matchesSearch && matchesCity;
    });
  }, [search, cityFilter]);

  return (
    <div className="space-y-4 lg:space-y-6">
      <PageHeader 
        title="السكن والمرافق" 
        subtitle="ابحث عن أفضل الفنادق والشقق القريبة من الأسواق الصينية الموصى بها من التجار." 
      />

      <SearchBar
        placeholder="ابحث عن اسم فندق أو شقة..."
        value={search}
        onChange={setSearch}
        filters={[
          {
            key: 'city',
            label: 'المدينة',
            options: [
              { value: 'كوانزو', label: 'كوانزو (Guangzhou)' },
              { value: 'إيوو', label: 'إيوو (Yiwu)' },
              { value: 'شينزين', label: 'شينزين (Shenzhen)' }
            ],
            value: cityFilter,
            onChange: setCityFilter,
          }
        ]}
      />

      {filteredAccommodations.length === 0 ? (
        <EmptyState message="لا يوجد سكن يطابق معايير البحث." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredAccommodations.map((acc, idx) => (
              <motion.div
                key={acc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                <Card className="overflow-hidden h-full flex flex-col group hover:shadow-lg transition-all border-border/50">
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img 
                      src={acc.image} 
                      alt={acc.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md text-sm font-bold shadow-sm flex items-center gap-1">
                      <Star className="w-4 h-4 fill-secondary text-secondary" />
                      {acc.rating} <span className="text-muted-foreground text-xs font-normal">({acc.reviewsCount})</span>
                    </div>
                  </div>
                  
                  <CardHeader className="p-4 pb-2 space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-lg line-clamp-1">{acc.name}</h3>
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{acc.city}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-0 flex-1 space-y-4">
                    <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
                      {acc.distance}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {acc.features.map(f => (
                        <Badge key={f} variant="secondary" className="font-normal text-xs bg-primary/5 text-primary">
                          {f}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0 border-t border-border/50 mt-auto flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">السعر بالليلة</p>
                      <p className="font-bold text-lg text-primary">{acc.pricePerNight} <span className="text-sm font-normal">{acc.currency}</span></p>
                    </div>
                    <Button size="sm" className="gap-2">
                      <ExternalLink className="w-4 h-4" /> حجز
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
