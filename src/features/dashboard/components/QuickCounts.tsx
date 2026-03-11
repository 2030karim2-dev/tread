import { motion } from 'framer-motion';
import { Plane, Ship, Users, Package, LucideIcon } from 'lucide-react';

interface QuickCountsProps {
    trips: number;
    suppliers: number;
    shipments: number;
    inventory: number;
}

interface CountItem {
    label: string;
    value: number;
    icon: LucideIcon;
    color: string;
}

export function QuickCounts({ trips, suppliers, shipments, inventory }: QuickCountsProps) {
    const items: CountItem[] = [
        { label: 'الرحلات', value: trips, icon: Plane, color: 'text-primary' },
        { label: 'الموردين', value: suppliers, icon: Users, color: 'text-secondary' },
        { label: 'الشحنات', value: shipments, icon: Ship, color: 'text-info' },
        { label: 'المنتجات', value: inventory, icon: Package, color: 'text-accent' },
    ];

    return (
        <div className="grid grid-cols-4 gap-2 lg:gap-3">
            {items.map((item, i) => (
                <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35 + i * 0.05 }}
                    className="bg-card rounded-xl border border-border p-3 shadow-card text-center"
                >
                    <item.icon className={`w-5 h-5 mx-auto mb-1.5 ${item.color}`} />
                    <p className="text-lg lg:text-xl font-extrabold">{item.value}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">{item.label}</p>
                </motion.div>
            ))}
        </div>
    );
}
