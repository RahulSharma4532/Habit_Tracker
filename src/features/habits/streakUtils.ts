import { HabitLog } from '../../types';
import { differenceInDays, parseISO, startOfDay, subDays } from 'date-fns';

export const calculateStreak = (logs: HabitLog[]): number => {
    if (logs.length === 0) return 0;

    const sortedDates = [...new Set(logs.map(log => log.date))]
        .sort((a, b) => b.localeCompare(a));

    const today = startOfDay(new Date());
    const yesterday = subDays(today, 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    let streak = 0;
    let checkDate = sortedDates[0] === todayStr ? today : (sortedDates[0] === yesterdayStr ? yesterday : null);

    if (!checkDate) return 0;

    for (let i = 0; i < sortedDates.length; i++) {
        const currentLogDate = sortedDates[i];
        const expectedDateStr = subDays(checkDate, streak).toISOString().split('T')[0];

        if (currentLogDate === expectedDateStr) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
};

export const getLongestStreak = (logs: HabitLog[]): number => {
    if (logs.length === 0) return 0;

    const sortedDates = [...new Set(logs.map(log => log.date))]
        .sort((a, b) => a.localeCompare(b));

    let maxStreak = 0;
    let currentStreak = 0;
    let lastDate: Date | null = null;

    for (const dateStr of sortedDates) {
        const currentDate = parseISO(dateStr);

        if (lastDate && differenceInDays(currentDate, lastDate) === 1) {
            currentStreak++;
        } else {
            currentStreak = 1;
        }

        maxStreak = Math.max(maxStreak, currentStreak);
        lastDate = currentDate;
    }

    return maxStreak;
};
