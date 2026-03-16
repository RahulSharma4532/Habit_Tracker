import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Download, X, Copy, Zap, Trophy, Heart } from 'lucide-react';
import { Habit } from '../../types';

interface ShareCardProps {
    habit: Habit;
    stats: {
        streak: number;
        health: number;
        completions: number;
    };
    onClose: () => void;
}

const ShareCard: React.FC<ShareCardProps> = ({ habit, stats, onClose }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateX: -20 }}
                transition={{ type: "spring", damping: 30, stiffness: 200 }}
                className="relative w-full max-w-[450px] space-y-8"
            >
                <div
                    ref={cardRef}
                    className="aspect-[4/5] w-full rounded-[4rem] bg-[#090b14] border border-white/10 overflow-hidden relative shadow-2xl"
                >
                    {/* Elite Background Geometry */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-[20%] -right-[20%] w-[120%] h-[120%] bg-gradient-to-br from-indigo-500/20 via-transparent to-pink-500/10 blur-[80px]" />
                        <div className="absolute top-[10%] left-[10%] w-px h-[80%] bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent" />
                        <div className="absolute top-[20%] right-[10%] w-[60%] h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
                    </div>

                    <div className="relative z-10 p-12 h-full flex flex-col justify-between">
                        <header className="flex justify-between items-start">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black tracking-[0.4em] text-indigo-400 uppercase leading-none">Personal Archive</span>
                                <span className="text-xl font-black text-white mt-1">HABIFLOW PRO</span>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                                <Zap size={24} className="text-indigo-400" />
                            </div>
                        </header>

                        <div className="space-y-8">
                            <div className="space-y-2">
                                <h3 className="text-4xl lg:text-5xl font-black text-white tracking-tightest leading-none">
                                    {habit.name}
                                </h3>
                                <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Active Protocol Objective</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <StatBox label="Consistency" value={`${stats.health}%`} color="text-indigo-400" />
                                <StatBox label="Pulse Streak" value={`${stats.streak}D`} color="text-pink-400" />
                                <StatBox label="Check-ins" value={`${stats.completions}`} color="text-emerald-400" />
                                <StatBox label="Architect" value="RANK S" color="text-amber-400" />
                            </div>
                        </div>

                        <footer className="pt-10 border-t border-white/5 flex justify-between items-end">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Global Ranking: #042</span>
                                <span className="text-[10px] font-black text-indigo-500/60 uppercase tracking-[0.2em]">Validated Protocol</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-1 h-3 bg-indigo-500" />
                                <div className="w-1 h-3 bg-indigo-500/50" />
                                <div className="w-1 h-3 bg-indigo-500/20" />
                            </div>
                        </footer>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button className="flex-1 py-5 bg-white text-black font-black rounded-3xl flex items-center justify-center gap-3 transition-transform active:scale-95">
                        <Download size={20} />
                        Save Fragment
                    </button>
                    <button
                        onClick={onClose}
                        className="w-20 py-5 bg-white/5 hover:bg-white/10 text-white rounded-3xl flex items-center justify-center transition-all active:scale-90"
                    >
                        <X size={24} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const StatBox: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
    <div className="space-y-1">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
        <p className={`text-2xl font-black ${color} tracking-tighter`}>{value}</p>
    </div>
);

export default ShareCard;
