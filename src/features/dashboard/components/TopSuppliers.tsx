import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { StarRating } from '@/components/shared';

interface Supplier {
    id: string;
    name: string;
    company_name: string;
    rating: number;
}

interface TopSuppliersProps {
    suppliers: Supplier[];
}

export function TopSuppliers({ suppliers }: TopSuppliersProps) {
    const sortedSuppliers = [...suppliers].sort((a, b) => b.rating - a.rating);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-xl sm:rounded-2xl border border-border p-3 sm:p-5 shadow-card h-full"
        >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="font-bold text-[10px] sm:text-sm flex items-center gap-1.5 sm:gap-2">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary" />
                    الموردين
                </h3>
            </div>
            <div className="space-y-1.5 sm:space-y-2.5">
                {sortedSuppliers.map((sup, i) => (
                    <div key={sup.id} className="flex items-center justify-between p-2 sm:p-3 rounded-lg sm:rounded-xl bg-muted/40">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg gradient-primary flex items-center justify-center text-[10px] sm:text-xs font-bold text-primary-foreground">
                                {i + 1}
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-[11px] sm:text-sm truncate">{sup.name}</p>
                                <p className="text-[9px] sm:text-xs text-muted-foreground truncate">{sup.company_name}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
