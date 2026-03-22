import { BarChart3 } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { formatNumber } from '@/lib/helpers';
import { GlowCard } from '@/components/shared';

interface InventoryBarChartProps {
    data: Array<{
        name: string;
        purchases: number;
        sales: number;
    }>;
}

export function InventoryBarChart({ data }: InventoryBarChartProps) {
    return (
        <GlowCard className="p-3 sm:p-5 h-full flex flex-col">
            <h3 className="font-bold text-[10px] sm:text-sm flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-4">
                <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                المشتريات مقابل المبيعات
            </h3>
            <div className="flex-1 min-h-[160px] sm:min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorPurchases" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border)/0.5)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{
                                background: 'hsl(var(--card)/0.9)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '12px',
                                fontSize: 12,
                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                            }}
                            formatter={(value: number) => [`$${formatNumber(value)}`, '']}
                        />
                        <Bar dataKey="purchases" name="المشتريات" fill="url(#colorPurchases)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="sales" name="المبيعات" fill="url(#colorSales)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </GlowCard>
    );
}
