import { Habit, HabitLog } from '../../types';
import { differenceInDays, parseISO, startOfDay, subDays } from 'date-fns';

export const calculateHealthScore = (habit: Habit, logs: HabitLog[]): number => {
    if (logs.length === 0) return 0;

    const now = new Date();
    const last30Days = Array.from({ length: 30 }, (_, i) => {
        const d = subDays(now, i);
        return d.toISOString().split('T')[0];
    });

    const completedDays = logs.filter(log => log.value >= habit.goal).length;
    const completionRate = completedDays / 30; // Normalized to 30 days

    // Streak Calculation
    let currentStreak = 0;
    const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));

    for (let i = 0; i < 30; i++) {
        const dateStr = last30Days[i];
        const log = sortedLogs.find(l => l.date === dateStr);
        if (log && log.value >= habit.goal) {
            currentStreak++;
        } else if (i > 0) {
            // Allow for today to be incomplete, but if yesterday was incomplete, streak breaks
            break;
        }
    }

    const streakBonus = Math.min(currentStreak / 30, 1);
    const consistencyBonus = logs.length > 5 ? 1 : logs.length / 5;

    // Formula: (CompletionRate * 0.5) + (StreakBonus * 0.3) + (Consistency * 0.2)
    const score = (completionRate * 0.5) + (streakBonus * 0.3) + (consistencyBonus * 0.2);

    return Math.round(score * 100);
};
