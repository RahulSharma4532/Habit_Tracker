import React from 'react';
import { motion } from 'framer-motion';
import { format, subDays, eachDayOfInterval, isSameDay } from 'date-fns';

interface HeatmapProps {
    logs: any[];
}

const Heatmap: React.FC<HeatmapProps> = ({ logs }) => {
    const end = new Date();
    const start = subDays(end, 180); // 6 months of data
    const days = eachDayOfInterval({ start, end });

    const getIntensity = (count: number) => {
        if (count === 0) return 'bg-white/[0.02] shadow-inner';
        if (count === 1) return 'bg-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.2)]';
        if (count <= 3) return 'bg-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.4)]';
        return 'bg-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.6)] animate-pulse';
    };

    return (
        <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex flex-wrap gap-1.5 min-w-[700px]">
                {days.map((day, i) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const count = logs.filter(log => log.date === dateStr).length;

                    return (
                        <motion.div
                            key={dateStr}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.002 }}
                            whileHover={{ scale: 1.5, zIndex: 50, rotate: 5 }}
                            className={`w-4 h-4 rounded-[3px] border border-white/5 cursor-pointer transition-all duration-300 ${getIntensity(count)}`}
                            title={`${dateStr}: ${count} actions`}
                        />
                    );
                })}
            </div>
            <div className="mt-8 flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Consistency:</span>
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-[2px] bg-white/[0.02]" />
                        <div className="w-3 h-3 rounded-[2px] bg-indigo-500/20" />
                        <div className="w-3 h-3 rounded-[2px] bg-indigo-500/40" />
                        <div className="w-3 h-3 rounded-[2px] bg-indigo-400" />
                    </div>
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    Total Data Points: <span className="text-white">{logs.length}</span>
                </div>
            </div>
        </div>
    );
};

export default Heatmap;
