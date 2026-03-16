import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Zap, ShoppingBag, Settings as SettingsIcon } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#030712] text-slate-50 flex flex-col font-sans selection:bg-indigo-500/30">
            {/* Glossy Navigation */}
            <header className="sticky top-0 z-[100] glass-morphism border-b border-white/5 px-6 py-5 backdrop-blur-2xl">
                <nav className="max-w-[1600px] mx-auto flex justify-between items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3 group cursor-pointer"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform duration-500">
                            <Zap size={22} className="text-white fill-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tighter leading-none">HabiFlow</span>
                            <span className="text-[10px] font-black tracking-[0.2em] text-indigo-400 uppercase opacity-80">Professional</span>
                        </div>
                    </motion.div>

                    <div className="hidden md:flex items-center gap-10 text-sm font-black uppercase tracking-widest text-slate-500">
                        <NavLink icon={<LayoutDashboard size={16} />} label="Forge" active />
                        <NavLink icon={<Zap size={16} />} label="Achievements" />
                        <NavLink icon={<ShoppingBag size={16} />} label="Vortex Shop" />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                            <SettingsIcon size={18} className="text-slate-400" />
                        </div>
                    </div>
                </nav>
            </header>

            <main className="flex-1 w-full overflow-x-hidden">
                {children}
            </main>

            <footer className="py-12 px-6 border-t border-white/5 text-center bg-[#020617]">
                <div className="max-w-7xl mx-auto space-y-4">
                    <p className="text-slate-600 text-xs font-black uppercase tracking-[0.4em]">
                        &copy; 2026 HabiFlow Pro &bull; Built with Advanced Agentic Architecture
                    </p>
                    <div className="flex justify-center gap-6 text-[10px] font-bold text-slate-700 uppercase tracking-widest">
                        <a href="#" className="hover:text-indigo-500 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-indigo-500 transition-colors">Terms</a>
                        <a href="#" className="hover:text-indigo-500 transition-colors">Elite Status</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const NavLink: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
    <a href="#" className={`flex items-center gap-2 transition-all duration-300 ${active ? 'text-white' : 'hover:text-slate-300'}`}>
        <span className={`${active ? 'text-indigo-400' : 'text-slate-700'}`}>{icon}</span>
        <span className="relative">
            {label}
            {active && <motion.div layoutId="nav-active" className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-500 rounded-full" />}
        </span>
    </a>
);

export default Layout;
