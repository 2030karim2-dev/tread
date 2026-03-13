import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';

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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-xl sm:rounded-2xl border border-border p-3 sm:p-5 shadow-card"
        >
            <h3 className="font-bold text-[10px] sm:text-sm flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-4">
                <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary" />
                توزيع المصاريف
            </h3>
            <div className="h-40 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={60}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                        >
                            {data.map((_, idx) => (
                                <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                background: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '12px',
                                fontSize: 12,
                            }}
                            formatter={(value: number) => [`$${value}`, '']}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
