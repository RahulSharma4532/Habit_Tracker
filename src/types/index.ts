export type HabitFrequency = 'daily' | 'weekly' | 'custom';

export interface Habit {
    id: string;
    name: string;
    category: string;
    frequency: HabitFrequency;
    goal: number;
    unit: string;
    color: string;
    icon: string;
    createdAt: number;
    tags: string[];
    reminderTime?: string; // 24h format
}

export interface HabitLog {
    id: string;
    habitId: string;
    date: string; // YYYY-MM-DD
    value: number;
    xpEarned: number;
    synced: boolean;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    unlockedAt?: number;
    icon: string;
    requirement: number;
    type: 'streak' | 'checkins' | 'level';
}

export interface UserStats {
    xp: number;
    level: number;
    totalCheckins: number;
    longestStreak: number;
}

export interface SyncOperation {
    id: string;
    type: 'CREATE' | 'UPDATE' | 'DELETE';
    table: 'habits' | 'logs';
    payload: any;
    timestamp: number;
}
