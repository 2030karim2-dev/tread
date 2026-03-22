import { DollarSign } from 'lucide-react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';
import { GlowCard } from '@/components/shared';

const CHART_COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--secondary))',
    'hsl(var(--accent))',
    'hsl(var(--info))',
    'hsl(var(--warning))',
    'hsl(var(--destructive))',
];

interface ExpensesPieChartProps {
    data: Array<{
        name: string;
        value: number;
    }>;
}

export function ExpensesPieChart({ data }: ExpensesPieChartProps) {
    return (
        <GlowCard className="p-3 sm:p-5 h-full flex flex-col">
            <h3 className="font-bold text-[10px] sm:text-sm flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-4">
                <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary" />
                توزيع المصاريف
            </h3>
            <div className="flex-1 min-h-[160px] sm:min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={80}
                            paddingAngle={5}
                            stroke="none"
                            cornerRadius={4}
                            dataKey="value"
                            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                        >
                            {data.map((_, idx) => (
                                <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                background: 'hsl(var(--card)/0.9)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '12px',
                                fontSize: 12,
                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                            }}
                            formatter={(value: number) => [`$${value}`, '']}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </GlowCard>
    );
}
