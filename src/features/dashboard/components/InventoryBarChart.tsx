import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { formatNumber } from '@/lib/helpers';

interface InventoryBarChartProps {
    data: Array<{
        name: string;
        purchases: number;
        sales: number;
    }>;
}

export function InventoryBarChart({ data }: InventoryBarChartProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-card rounded-2xl border border-border p-5 shadow-card"
        >
            <h3 className="font-bold text-sm flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-primary" />
                المشتريات مقابل المبيعات
            </h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                        <Tooltip
                            contentStyle={{
                                background: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '12px',
                                fontSize: 12,
                            }}
                            formatter={(value: number) => [`$${formatNumber(value)}`, '']}
                        />
                        <Bar dataKey="purchases" name="المشتريات" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="sales" name="المبيعات" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
