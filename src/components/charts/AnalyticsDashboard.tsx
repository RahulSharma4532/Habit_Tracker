import React, { useMemo } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { Habit, HabitLog } from '../../types';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { motion } from 'framer-motion';

interface AnalyticsDashboardProps {
    habits: Habit[];
    logs: HabitLog[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ habits, logs }) => {
    const chartData = useMemo(() => {
        const end = new Date();
        const start = subDays(end, 14); // 14-day trend for better resolution
        const interval = eachDayOfInterval({ start, end });

        return interval.map(date => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const dailyLogs = logs.filter(log => log.date === dateStr);
            return {
                date: format(date, 'MMM d'),
                checkins: dailyLogs.length,
                xp: dailyLogs.reduce((acc, log) => acc + log.xpEarned, 0)
            };
        });
    }, [logs]);

    const categoryData = useMemo(() => {
        const counts: Record<string, number> = {};
        habits.forEach(h => {
            counts[h.category] = (counts[h.category] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [habits]);

    const COLORS = ['#6366f1', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Primary XP Velocity Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="glass-morphism p-10 rounded-[3rem] cyber-card-glow"
            >
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-black text-white tracking-tight italic">Velocity Delta (XP)</h3>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Real-time Stream</span>
                    </div>
                </div>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#475569"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontWeight: 900 }}
                            />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#090b14',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '20px',
                                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
                                    backdropFilter: 'blur(20px)'
                                }}
                                itemStyle={{ color: '#f8fafc', fontWeight: 900, fontSize: '12px' }}
                                cursor={{ stroke: 'rgba(99, 102, 241, 0.2)', strokeWidth: 2 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="xp"
                                stroke="#6366f1"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorXp)"
                                animationDuration={2000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-8 pt-8 border-t border-white/5 flex gap-10">
                    <StatMini label="Avg Daily XP" value="240" />
                    <StatMini label="Pulse Stability" value="89%" />
                </div>
            </motion.div>

            {/* Category Cluster Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-morphism p-10 rounded-[3rem] cyber-card-glow"
            >
                <h3 className="text-xl font-black text-white tracking-tight italic mb-8">Structural Allocation</h3>
                <div className="h-72 flex justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={8}
                                dataKey="value"
                                stroke="none"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                        className="hover:opacity-80 transition-opacity cursor-pointer"
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#090b14',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '20px',
                                    backdropFilter: 'blur(20px)'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                    {categoryData.slice(0, 4).map((entry, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{entry.name}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

const StatMini: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="space-y-1">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
        <p className="text-lg font-black text-white leading-none">{value}</p>
    </div>
);

export default AnalyticsDashboard;
