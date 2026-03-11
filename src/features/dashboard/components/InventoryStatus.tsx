import { motion } from 'framer-motion';
import { Warehouse } from 'lucide-react';

interface Product {
    id: string;
    product_name: string;
    quantity_available: number;
    quantity_purchased: number;
}

interface InventoryStatusProps {
    inventory: Product[];
}

export function InventoryStatus({ inventory }: InventoryStatusProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-card rounded-2xl border border-border p-5 shadow-card"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm flex items-center gap-2">
                    <Warehouse className="w-4 h-4 text-accent" />
                    حالة المخزون
                </h3>
            </div>
            <div className="space-y-3">
                {inventory.map(item => {
                    const pct = Math.round((item.quantity_available / item.quantity_purchased) * 100);
                    const isLow = pct < 30;
                    return (
                        <div key={item.id} className="p-3 rounded-xl bg-muted/40">
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-semibold text-sm">{item.product_name}</p>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isLow ? 'bg-destructive/10 text-destructive' : 'bg-accent/10 text-accent'
                                    }`}>
                                    {item.quantity_available} متوفر
                                </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    className={`h-full rounded-full ${pct > 50 ? 'bg-accent' : pct > 20 ? 'bg-secondary' : 'bg-destructive'
                                        }`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
