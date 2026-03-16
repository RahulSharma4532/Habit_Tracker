import React, { useState, useEffect, useRef } from 'react';
import Layout from './layout';
import { useStore } from '../store/useStore';
import { habitService } from '../features/habits/habitService';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
    Plus, Check, Trash2, Activity, BarChart3, Calendar,
    Trophy, ChevronRight, Bell, Settings, Share2, Download, Upload, Zap,
    Cpu, Globe, Shield, Rocket
} from 'lucide-react';
import { calculateHealthScore } from '../features/analytics/healthScore';
import { progressToNextLevel, XP_ACTION_REWARDS } from '../features/gamification/xpSystem';
import Heatmap from '../components/heatmap/Heatmap';
import AnalyticsDashboard from '../components/charts/AnalyticsDashboard';
import AchievementsList from '../components/gamification/AchievementsList';
import InsightCards from '../components/shared/InsightCards';
import ShareCard from '../components/shared/ShareCard';
import { generateInsights, HabitInsight } from '../features/insights/insightEngine';
import { notificationService } from '../features/notifications/notificationService';
import { dataService } from '../features/shared/dataService';
import { syncService } from '../features/shared/syncService';
import { achievementService } from '../features/gamification/achievementService';

const App: React.FC = () => {
    const {
        habits, stats, achievements,
        setHabits, addHabit, removeHabit, setAchievements, updateXP
    } = useStore();

    const [showAddModal, setShowAddModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [sharingHabit, setSharingHabit] = useState<any>(null);
    const [newHabitName, setNewHabitName] = useState('');
    const [habitLogs, setHabitLogs] = useState<Record<string, any[]>>({});
    const [allLogs, setAllLogs] = useState<any[]>([]);
    const [insights, setInsights] = useState<HabitInsight[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                console.log('HabiFlow: Loading system data...');
                const data = await habitService.getAllHabits();
                setHabits(data);

                const logsMap: Record<string, any[]> = {};
                for (const habit of data) {
                    logsMap[habit.id] = await habitService.getLogsByHabit(habit.id);
                }
                setHabitLogs(logsMap);

                const logs = await habitService.getAllLogs();
                setAllLogs(logs);

                const unlocked = await achievementService.getUnlockedAchievements();
                setAchievements(unlocked);

                notificationService.requestPermission();
                syncService.processQueue();
                console.log('HabiFlow: System ready.');
            } catch (err) {
                console.error('HabiFlow: Data initialization failure:', err);
            }
        };
        loadData();
    }, []); // Run only on mount

    useEffect(() => {
        if (habits.length > 0 && allLogs.length > 0) {
            const newInsights = generateInsights(habits, allLogs);
            setInsights(newInsights);
        }
    }, [habits, allLogs]);

    const handleAddHabit = async () => {
        if (!newHabitName.trim()) return;
        const habit = await habitService.saveHabit({
            name: newHabitName,
            category: 'General',
            frequency: 'daily',
            goal: 1,
            unit: 'times',
            color: '#6366f1',
            icon: 'zap',
            tags: [],
        });
        addHabit(habit);
        await syncService.addToQueue('CREATE', 'habits', habit);
        setNewHabitName('');
        setShowAddModal(false);
        notificationService.scheduleNotification('Habit Activated', {
            body: `System entry confirmed: '${newHabitName}' is online.`
        });
    };

    const handleDeleteHabit = async (id: string) => {
        await habitService.deleteHabit(id);
        removeHabit(id);
        await syncService.addToQueue('DELETE', 'habits', { id });
    };

    const handleCheckIn = async (habitId: string) => {
        const today = new Date().toISOString().split('T')[0];
        const log = await habitService.logHabit(habitId, today, 1, XP_ACTION_REWARDS.HABIT_CHECKIN);
        await syncService.addToQueue('CREATE', 'logs', log);

        const newUnlocks = await updateXP(XP_ACTION_REWARDS.HABIT_CHECKIN);

        if (newUnlocks.length > 0) {
            notificationService.scheduleNotification('Level Up!', {
                body: `Protocol upgrade unlocked: ${newUnlocks[0].title}!`,
            });
        }

        const updatedLogs = await habitService.getLogsByHabit(habitId);
        setHabitLogs(prev => ({ ...prev, [habitId]: updatedLogs }));
        const logs = await habitService.getAllLogs();
        setAllLogs(logs);
    };

    return (
        <Layout>
            {/* The Ultimate Mesh Gradient Background */}
            <div className="mesh-gradient" />
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
                <div className="bg-blob w-[60vw] h-[60vw] bg-indigo-500/10 -top-20 -left-20" />
                <div className="bg-blob w-[50vw] h-[50vw] bg-purple-500/10 -bottom-20 -right-20" />
            </div>

            <div className="p-6 lg:p-16 max-w-[1800px] mx-auto space-y-16 relative z-10">
                <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black tracking-[0.3em] rounded-full border border-indigo-500/20 uppercase">
                                System Status: Operational
                            </span>
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black gradient-text tracking-tightest leading-[0.9]">
                            HABIFLOW<br /><span className="opacity-50">PRO.V9</span>
                        </h1>
                        <p className="text-slate-400 mt-6 text-xl font-medium max-w-2xl leading-relaxed">
                            Orchestrating behavioral excellence with high-fidelity architecture and data-driven discipline.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex gap-4"
                    >
                        <button
                            onClick={() => setShowSettingsModal(true)}
                            className="p-5 bg-white/5 hover:bg-white/10 rounded-[2rem] transition-all border border-white/5 group active:scale-90"
                        >
                            <Cpu size={24} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
                        </button>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-[2.5rem] font-black flex items-center gap-4 transition-all shadow-[0_20px_50px_rgba(79,70,229,0.3)] group active:scale-95"
                        >
                            <Plus size={24} />
                            <span className="text-lg">Activate Protocol</span>
                        </button>
                    </motion.div>
                </header>

                {/* Holographic Stats Orbs */}
                <motion.section
                    variants={{
                        show: { transition: { staggerChildren: 0.1 } }
                    }}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    <HolographicStat
                        icon={<Rocket size={20} />}
                        label="Evolution Level"
                        value={`${stats.level}`}
                        color="from-indigo-500 to-blue-600"
                        progress={progressToNextLevel(stats.xp)}
                        subtext={`${progressToNextLevel(stats.xp)}% to system upgrade`}
                    />
                    <HolographicStat
                        icon={<Activity size={20} />}
                        label="Neural Pulse (XP)"
                        value={`${stats.xp}`}
                        color="from-purple-500 to-pink-600"
                        subtext="Cumulative performance data"
                    />
                    <HolographicStat
                        icon={<Shield size={20} />}
                        label="Continuity Streak"
                        value={`${stats.longestStreak}D`}
                        color="from-emerald-500 to-teal-600"
                        subtext="Longest unbroken chain"
                    />
                    <HolographicStat
                        icon={<Globe size={20} />}
                        label="Forge Integrity"
                        value={`${Math.round(stats.totalCheckins * 1.5)}%`}
                        color="from-amber-500 to-orange-600"
                        subtext="Global consistency metric"
                    />
                </motion.section>

                <div className="grid grid-cols-1 2xl:grid-cols-12 gap-16">
                    <div className="2xl:col-span-8 space-y-16">
                        <motion.section
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="glass-morphism p-10 rounded-[3rem] cyber-card-glow overflow-hidden"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-3xl font-black flex items-center gap-4 tracking-tighter">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                        <Calendar size={22} />
                                    </div>
                                    Sync Matrix
                                </h2>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Feed Integration</span>
                            </div>
                            <Heatmap logs={allLogs} />
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-10"
                        >
                            <h2 className="text-3xl font-black flex items-center gap-4 tracking-tighter">
                                <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400">
                                    <BarChart3 size={22} />
                                </div>
                                System Telemetry
                            </h2>
                            <AnalyticsDashboard habits={habits} logs={allLogs} />
                        </motion.section>
                    </div>

                    <div className="2xl:col-span-4 space-y-12">
                        <section className="space-y-8">
                            <h2 className="text-2xl font-black flex items-center gap-4 tracking-tighter uppercase tracking-[0.1em]">
                                <span className="text-indigo-500">/</span> Active Protocols
                            </h2>
                            <div className="space-y-5">
                                <AnimatePresence mode="popLayout">
                                    {habits.map((habit, index) => (
                                        <ProtocolCard
                                            key={habit.id}
                                            habit={habit}
                                            index={index}
                                            logs={habitLogs[habit.id] || []}
                                            onCheckIn={() => handleCheckIn(habit.id)}
                                            onDelete={() => handleDeleteHabit(habit.id)}
                                            onShare={() => setSharingHabit(habit)}
                                        />
                                    ))}
                                </AnimatePresence>
                                {habits.length === 0 && (
                                    <div className="glass-morphism py-24 rounded-[3rem] border-dashed border-white/5 flex flex-col items-center justify-center text-slate-600 space-y-6">
                                        <div className="w-20 h-20 rounded-full bg-white/[0.02] flex items-center justify-center">
                                            <Plus size={40} className="opacity-20 translate-y-1" />
                                        </div>
                                        <p className="font-bold text-sm uppercase tracking-widest opacity-40 italic">Standby Mode. No active protocols.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        <InsightCards insights={insights} />
                        <AchievementsList unlocked={achievements} />
                    </div>
                </div>
            </div>

            {/* Modals with Architect Physics */}
            <AnimatePresence>
                {showAddModal && (
                    <EliteModal onClose={() => setShowAddModal(false)} title="Initialize Protocol">
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">Protocol Identifier</label>
                                <input
                                    type="text"
                                    value={newHabitName}
                                    onChange={(e) => setNewHabitName(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/10 p-5 rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white font-bold transition-all placeholder:text-slate-700 text-xl"
                                    placeholder="Enter Protocol Name..."
                                    autoFocus
                                />
                            </div>
                            <button
                                onClick={handleAddHabit}
                                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 font-black rounded-[2rem] shadow-xl shadow-indigo-600/20 text-lg transition-all active:scale-95 group"
                            >
                                <span className="flex items-center justify-center gap-3">
                                    Confirm Activation
                                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </div>
                    </EliteModal>
                )}
            </AnimatePresence>
        </Layout>
    );
};

const HolographicStat: React.FC<{ label: string; value: string; color: string; icon: React.ReactNode; progress?: number; subtext: string }> = ({ label, value, color, icon, progress, subtext }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
        }}
        whileHover={{ y: -10, scale: 1.02 }}
        className="glass-morphism p-10 rounded-[3rem] relative overflow-hidden group border-white/[0.03]"
    >
        <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} bg-opacity-10 text-white shadow-lg`}>
                    {icon}
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</div>
            </div>

            <div className={`text-5xl font-black bg-gradient-to-br ${color} bg-clip-text text-transparent tracking-tightest`}>
                {value}
            </div>

            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest opacity-60">
                {subtext}
            </div>

            {progress !== undefined && (
                <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden mt-4">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                        className={`h-full bg-gradient-to-r ${color}`}
                    />
                </div>
            )}
        </div>

        {/* Subtle holographic inner glow */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700`} />
    </motion.div>
);

const ProtocolCard: React.FC<{
    habit: any;
    index: number;
    logs: any[];
    onCheckIn: () => void;
    onDelete: () => void;
    onShare: () => void;
}> = ({ habit, index, logs, onCheckIn, onDelete, onShare }) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const health = calculateHealthScore(habit, logs);

    return (
        <motion.div
            ref={ref}
            layout
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            transition={{ delay: index * 0.05, type: "spring", damping: 20 }}
            className="glass-morphism p-6 rounded-[2.5rem] flex items-center justify-between group cursor-pointer border-white/[0.03] hover:border-white/[0.08]"
        >
            <div className="flex items-center gap-6" style={{ transform: "translateZ(50px)" }}>
                <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Zap size={28} />
                </div>
                <div>
                    <h3 className="text-xl font-black text-white tracking-tight">{habit.name}</h3>
                    <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] font-black p-1.5 bg-white/5 rounded-md text-slate-500 uppercase tracking-widest">{habit.frequency}</span>
                        <div className={`text-[10px] font-black px-2 py-1 rounded-md border ${health > 70 ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/[0.02]' : 'border-rose-500/30 text-rose-400 bg-rose-500/[0.02]'}`}>
                            INTEGRITY: {health}%
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2" style={{ transform: "translateZ(30px)" }}>
                <button onClick={onShare} className="p-3 text-slate-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"><Share2 size={18} /></button>
                <button onClick={onCheckIn} className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20 active:scale-90 transition-all"><Check size={20} /></button>
                <button onClick={onDelete} className="p-3 text-rose-500/40 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
            </div>
        </motion.div>
    );
};

const EliteModal: React.FC<{ children: React.ReactNode; onClose: () => void; title: string }> = ({ children, onClose, title }) => (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-3xl"
        />
        <motion.div
            initial={{ opacity: 0, y: 100, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl bg-[#090b14] border border-white/[0.05] p-12 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden"
        >
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />
            <h2 className="text-4xl font-black mb-10 text-white tracking-tightest leading-none">{title}</h2>
            {children}
            <button onClick={onClose} className="absolute top-10 right-10 text-slate-500 hover:text-white transition-colors">
                <Trash2 size={24} />
            </button>
        </motion.div>
    </div>
);

export default App;
