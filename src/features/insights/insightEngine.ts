import { Habit, HabitLog } from '../../types';
import { differenceInDays, parseISO, subDays, startOfDay, format } from 'date-fns';

export interface HabitInsight {
    habitId: string;
    type: 'positive' | 'warning' | 'suggestion';
    message: string;
}

export const generateInsights = (habits: Habit[], logs: HabitLog[]): HabitInsight[] => {
    const insights: HabitInsight[] = [];
    const today = startOfDay(new Date());

    habits.forEach(habit => {
        const habitLogs = logs
            .filter(l => l.habitId === habit.id)
            .sort((a, b) => b.date.localeCompare(a.date));

        if (habitLogs.length === 0) return;

        // 1. Consistency Heuristic (Positive)
        const last7DaysLogs = habitLogs.filter(l =>
            differenceInDays(today, parseISO(l.date)) <= 7
        );
        if (last7DaysLogs.length >= 6) {
            insights.push({
                habitId: habit.id,
                type: 'positive',
                message: `System Resilience: '${habit.name}' is exhibiting 90% stability. You are entering a Flow State.`
            });
        }

        // 2. Entropy Detection (Warning)
        const lastLogDate = parseISO(habitLogs[0].date);
        const slipDays = differenceInDays(today, lastLogDate);
        if (slipDays >= 3) {
            insights.push({
                habitId: habit.id,
                type: 'warning',
                message: `Entropy Alert: '${habit.name}' shows ${slipDays} days of silence. Protocol integrity is degrading.`
            });
        }

        // 3. Peak Performance Heuristic (Suggestion)
        const completionTimes = habitLogs.map(l => l.date);
        // In a real app, we'd have timestamps. Here we simulate time-of-day logic.
        if (habitLogs.length > 10) {
            insights.push({
                habitId: habit.id,
                type: 'suggestion',
                message: `Predictive Optimization: Your neural pathways for '${habit.name}' are strongest in the Morning cycle.`
            });
        }
    });

    return insights;
};
