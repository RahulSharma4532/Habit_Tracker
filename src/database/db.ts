import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Habit, HabitLog, Achievement, SyncOperation } from '../types';

interface HabitDB extends DBSchema {
    habits: {
        key: string;
        value: Habit;
        indexes: { 'by-created': number };
    };
    logs: {
        key: string;
        value: HabitLog;
        indexes: { 'by-date': string; 'by-habit': string };
    };
    achievements: {
        key: string;
        value: Achievement;
    };
    syncQueue: {
        key: string;
        value: SyncOperation;
        indexes: { 'by-timestamp': number };
    };
}

const DB_NAME = 'habiflow_pro_db_v2'; // Changed name to be absolutely sure we start fresh
const DB_VERSION = 1;

export const initDB = async (): Promise<IDBPDatabase<HabitDB>> => {
    return openDB<HabitDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // Habits Table
            const habitStore = db.createObjectStore('habits', { keyPath: 'id' });
            habitStore.createIndex('by-created', 'createdAt');

            // Logs Table
            const logStore = db.createObjectStore('logs', { keyPath: 'id' });
            logStore.createIndex('by-date', 'date');
            logStore.createIndex('by-habit', 'habitId');

            // Achievements
            db.createObjectStore('achievements', { keyPath: 'id' });

            // Sync Queue
            const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
            syncStore.createIndex('by-timestamp', 'timestamp');
        },
    });
};
