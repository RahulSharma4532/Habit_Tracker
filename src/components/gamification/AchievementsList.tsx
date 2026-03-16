import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Target, Crown, Zap, Shield, Rocket } from 'lucide-react';
import { Achievement } from '../../types';

interface AchievementsListProps {
    unlocked: Achievement[];
}

const AchievementsList: React.FC<AchievementsListProps> = ({ unlocked }) => {
    const ICON_MAP: Record<string, any> = {
        '🚀': <Rocket size={20} />,
        '👑': <Crown size={20} />,
        '⚡': <Zap size={20} />,
        '🏆': <Trophy size={20} />,
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black flex items-center gap-4 tracking-tighter uppercase tracking-[0.1em]">
                <span className="text-amber-500">/</span> Hall of Mastery
            </h2>
            <div className="grid grid-cols-2 gap-4">
                <AnimatePresence>
                    {unlocked.map((achievement, index) => (
                        <motion.div
                            key={achievement.id}
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            whileHover={{ y: -5, scale: 1.05 }}
                            transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                            className="glass-morphism p-5 rounded-[2.5rem] border-white/5 relative overflow-hidden group text-center flex flex-col items-center justify-center gap-3"
                        >
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-600/20 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all duration-500">
                                <div className="text-2xl">{achievement.icon}</div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Status: Unlocked</p>
                                <h3 className="text-sm font-black text-white tracking-tight">{achievement.title}</h3>
                            </div>

                            {/* Holographic sparkle effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </motion.div>
                    ))}
                </AnimatePresence>
                {unlocked.length === 0 && (
                    <div className="col-span-2 glass-morphism py-12 rounded-[2.5rem] border-dashed border-white/5 flex flex-col items-center justify-center text-slate-600 gap-3">
                        <Trophy size={32} className="opacity-10" />
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Earn XP to unlock trophies</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AchievementsList;
