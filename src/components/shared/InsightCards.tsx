import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, TrendingUp, AlertCircle, Cpu } from 'lucide-react';
import { HabitInsight } from '../../features/insights/insightEngine';

interface InsightCardsProps {
    insights: HabitInsight[];
}

const InsightCards: React.FC<InsightCardsProps> = ({ insights }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black flex items-center gap-4 tracking-tighter uppercase tracking-[0.1em]">
                <span className="text-purple-500">/</span> AI Core Insights
            </h2>
            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                    {insights.map((insight, index) => (
                        <motion.div
                            key={insight.habitId + insight.type}
                            layout
                            initial={{ opacity: 0, scale: 0.9, x: -20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
                            transition={{ delay: index * 0.1, type: "spring", damping: 20 }}
                            className="glass-morphism p-6 rounded-[2rem] border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-all duration-500"
                        >
                            <div className="relative z-10 flex gap-5">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${insight.type === 'positive' ? 'bg-emerald-500/10 text-emerald-400' :
                                        insight.type === 'warning' ? 'bg-amber-500/10 text-amber-400' : 'bg-indigo-500/10 text-indigo-400'
                                    }`}>
                                    {insight.type === 'positive' ? <TrendingUp size={24} /> :
                                        insight.type === 'warning' ? <AlertCircle size={24} /> : <Brain size={24} />}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Cpu size={12} className="opacity-40" />
                                        {insight.type === 'positive' ? 'Growth Detected' : 'Stagnation Alert'}
                                    </p>
                                    <p className="text-white font-bold text-sm leading-relaxed group-hover:text-purple-100 transition-colors">
                                        {insight.message}
                                    </p>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                <Sparkles size={16} className="text-purple-400 animate-pulse" />
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-purple-500/5 blur-2xl rounded-full" />
                        </motion.div>
                    ))}
                </AnimatePresence>
                {insights.length === 0 && (
                    <div className="glass-morphism p-8 rounded-[2rem] border-dashed border-white/5 flex flex-col items-center justify-center text-slate-600">
                        <Brain size={30} className="opacity-10 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Scanning for patterns...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InsightCards;
