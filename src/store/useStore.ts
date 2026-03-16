import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Habit, UserStats, Achievement } from '../types';
import { calculateLevel, XP_ACTION_REWARDS } from '../features/gamification/xpSystem';
import { achievementService } from '../features/gamification/achievementService';

interface AppState {
    habits: Habit[];
    stats: UserStats;
    achievements: Achievement[];
    loading: boolean;
    setHabits: (habits: Habit[]) => void;
    addHabit: (habit: Habit) => void;
    updateHabit: (habit: Habit) => void;
    removeHabit: (id: string) => void;
    setAchievements: (achievements: Achievement[]) => void;
    updateXP: (amount: number) => Promise<Achievement[]>;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            habits: [],
            stats: {
                xp: 0,
                level: 1,
                totalCheckins: 0,
                longestStreak: 0,
            },
            achievements: [],
            loading: false,
            setHabits: (habits) => set({ habits }),
            addHabit: (habit) => set((state) => ({ habits: [...state.habits, habit] })),
            updateHabit: (habit) => set((state) => ({
                habits: state.habits.map(h => h.id === habit.id ? habit : h)
            })),
            removeHabit: (id) => set((state) => ({
                habits: state.habits.filter(h => h.id !== id)
            })),
            setAchievements: (achievements) => set({ achievements }),
            updateXP: async (amount) => {
                const state = get();
                const newXP = state.stats.xp + amount;
                const newLevel = calculateLevel(newXP);
                const newStats = {
                    ...state.stats,
                    xp: newXP,
                    level: newLevel,
                    totalCheckins: amount === XP_ACTION_REWARDS.HABIT_CHECKIN ? state.stats.totalCheckins + 1 : state.stats.totalCheckins
                };

                set({ stats: newStats });

                // Check for achievements
                const newUnlocks = await achievementService.checkAchievements(newStats, []);
                if (newUnlocks.length > 0) {
                    set({ achievements: [...state.achievements, ...newUnlocks] });
                }
                return newUnlocks;
            },
        }),
        {
            name: 'habiflow-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
