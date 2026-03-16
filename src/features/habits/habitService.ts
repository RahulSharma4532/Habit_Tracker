import { initDB } from '../../database/db';
import { Habit, HabitLog } from '../../types';

export const habitService = {
    async getAllHabits(): Promise<Habit[]> {
        const db = await initDB();
        return db.getAll('habits');
    },

    async saveHabit(habit: Omit<Habit, 'id' | 'createdAt'>): Promise<Habit> {
        const db = await initDB();
        const newHabit: Habit = {
            ...habit,
            id: typeof crypto.randomUUID !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).substring(2),
            createdAt: Date.now(),
        };
        await db.put('habits', newHabit);
        return newHabit;
    },

    async updateHabit(habit: Habit): Promise<void> {
        const db = await initDB();
        await db.put('habits', habit);
    },

    async deleteHabit(id: string): Promise<void> {
        const db = await initDB();
        const tx = db.transaction(['habits', 'logs'], 'readwrite');
        await tx.objectStore('habits').delete(id);

        // Cleanup logs
        const logStore = tx.objectStore('logs');
        const index = logStore.index('by-habit');
        let cursor = await index.openCursor(IDBKeyRange.only(id));
        while (cursor) {
            await cursor.delete();
            cursor = await cursor.continue();
        }
        await tx.done;
    },

    async logHabit(habitId: string, date: string, value: number, xpEarned: number): Promise<HabitLog> {
        const db = await initDB();
        const log: HabitLog = {
            id: typeof crypto.randomUUID !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).substring(2),
            habitId,
            date,
            value,
            xpEarned,
            synced: false,
        };
        await db.put('logs', log);
        return log;
    },

    async getLogsByHabit(habitId: string): Promise<HabitLog[]> {
        const db = await initDB();
        return db.getAllFromIndex('logs', 'by-habit', habitId);
    },

    async getLogsByDate(date: string): Promise<HabitLog[]> {
        const db = await initDB();
        return db.getAllFromIndex('logs', 'by-date', date);
    },

    async getAllLogs(): Promise<HabitLog[]> {
        const db = await initDB();
        return db.getAll('logs');
    }
};
