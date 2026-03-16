export const calculateLevel = (xp: number): number => {
    // Formula: Level = floor(sqrt(xp / 100)) + 1
    return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const xpForLevel = (level: number): number => {
    // Formula: XP = (Level - 1)^2 * 100
    return Math.pow(level - 1, 2) * 100;
};

export const progressToNextLevel = (xp: number): number => {
    const currentLevel = calculateLevel(xp);
    const currentLevelXp = xpForLevel(currentLevel);
    const nextLevelXp = xpForLevel(currentLevel + 1);
    const progression = xp - currentLevelXp;
    const totalNeeded = nextLevelXp - currentLevelXp;
    return Math.round((progression / totalNeeded) * 100);
};

export const XP_ACTION_REWARDS = {
    HABIT_CHECKIN: 10,
    STREAK_MILESTONE: 50,
    ACHIEVEMENT_UNLOCK: 100,
};
