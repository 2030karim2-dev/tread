import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';
import { StatusBadge } from '@/components/shared';

import { Trip } from '@/types';

interface ActiveTripsProps {
    trips: Trip[];
}

export function ActiveTrips({ trips }: ActiveTripsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-xl sm:rounded-2xl border border-border p-3 sm:p-5 shadow-card h-full"
        >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="font-bold text-[10px] sm:text-sm flex items-center gap-1.5 sm:gap-2">
                    <Plane className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                    الرحلات
                </h3>
                <span className="text-[9px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                    {trips.length}
                </span>
            </div>
            <div className="space-y-1.5 sm:space-y-2.5">
                {trips.map(trip => (
                    <div key={trip.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 rounded-lg sm:rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors gap-1.5">
                        <div>
                            <p className="font-bold text-[11px] sm:text-sm leading-none">{trip.name}</p>
                            <p className="text-[9px] sm:text-xs text-muted-foreground mt-1">{trip.city}</p>
                        </div>
                        <StatusBadge status={trip.status || 'planning'} />
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
