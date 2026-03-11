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
            className="bg-card rounded-2xl border border-border p-5 shadow-card"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-secondary" />
                    أفضل الموردين
                </h3>
            </div>
            <div className="space-y-2.5">
                {sortedSuppliers.map((sup, i) => (
                    <div key={sup.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                                {i + 1}
                            </div>
                            <div>
                                <p className="font-semibold text-sm">{sup.name}</p>
                                <p className="text-xs text-muted-foreground">{sup.company_name}</p>
                            </div>
                        </div>
                        <StarRating rating={sup.rating} />
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
