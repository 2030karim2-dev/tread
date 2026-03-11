import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';
import { StatusBadge } from '@/components/shared';

interface Trip {
    id: string;
    name: string;
    city: string;
    start_date: string;
    status: string;
}

interface ActiveTripsProps {
    trips: Trip[];
}

export function ActiveTrips({ trips }: ActiveTripsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-2xl border border-border p-5 shadow-card"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm flex items-center gap-2">
                    <Plane className="w-4 h-4 text-primary" />
                    الرحلات النشطة
                </h3>
                <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {trips.length} رحلة
                </span>
            </div>
            <div className="space-y-2.5">
                {trips.map(trip => (
                    <div key={trip.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                        <div>
                            <p className="font-semibold text-sm">{trip.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{trip.city} • {trip.start_date}</p>
                        </div>
                        <StatusBadge status={trip.status} />
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
