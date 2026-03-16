import { initDB } from '../../database/db';
import { Achievement, UserStats, HabitLog } from '../../types';

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_step',
        title: 'First Step',
        description: 'Complete your first habit check-in.',
        icon: '🚀',
        requirement: 1,
        type: 'checkins',
    },
    {
        id: 'consistency_king',
        title: 'Consistency King',
        description: 'Reach a 7-day streak on any habit.',
        icon: '👑',
        requirement: 7,
        type: 'streak',
    },
    {
        id: 'power_user',
        title: 'Power User',
        description: 'Complete 50 total check-ins.',
        icon: '⚡',
        requirement: 50,
        type: 'checkins',
    },
    {
        id: 'level_10',
        title: 'Apex Achiever',
        description: 'Reach Level 10.',
        icon: '🏆',
        requirement: 10,
        type: 'level',
    }
];

export const achievementService = {
    async getUnlockedAchievements(): Promise<Achievement[]> {
        const db = await initDB();
        return db.getAll('achievements');
    },

    async checkAchievements(stats: UserStats, logs: HabitLog[]): Promise<Achievement[]> {
        const unlocked = await this.getUnlockedAchievements();
        const newUnlocks: Achievement[] = [];
        const db = await initDB();

        for (const achievement of ACHIEVEMENTS) {
            if (unlocked.find(a => a.id === achievement.id)) continue;

            let met = false;
            if (achievement.type === 'checkins' && stats.totalCheckins >= achievement.requirement) met = true;
            if (achievement.type === 'level' && stats.level >= achievement.requirement) met = true;
            if (achievement.type === 'streak' && stats.longestStreak >= achievement.requirement) met = true;

            if (met) {
                const unlock: Achievement = { ...achievement, unlockedAt: Date.now() };
                await db.put('achievements', unlock);
                newUnlocks.push(unlock);
            }
        }

        return newUnlocks;
    }
};
