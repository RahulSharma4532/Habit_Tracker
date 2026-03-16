import { initDB } from '../../database/db';
import { Habit, HabitLog, Achievement } from '../../types';

export const dataService = {
    async exportAppData(): Promise<string> {
        const db = await initDB();
        const habits = await db.getAll('habits');
        const logs = await db.getAll('logs');
        const achievements = await db.getAll('achievements');

        const exportData = {
            version: '1.0',
            timestamp: Date.now(),
            habits,
            logs,
            achievements,
            stats: JSON.parse(localStorage.getItem('habiflow-storage') || '{}').state?.stats
        };

        return JSON.stringify(exportData, null, 2);
    },

    async importAppData(jsonString: string): Promise<void> {
        try {
            const data = JSON.parse(jsonString);
            if (!data.habits || !data.logs) throw new Error('Invalid backup file');

            const db = await initDB();
            const tx = db.transaction(['habits', 'logs', 'achievements'], 'readwrite');

            // Clear existing the data first for a clean import
            await tx.objectStore('habits').clear();
            await tx.objectStore('logs').clear();
            await tx.objectStore('achievements').clear();

            for (const h of data.habits) await tx.objectStore('habits').put(h);
            for (const l of data.logs) await tx.objectStore('logs').put(l);
            if (data.achievements) {
                for (const a of data.achievements) await tx.objectStore('achievements').put(a);
            }

            await tx.done;

            // Update localStorage stats if present
            if (data.stats) {
                const storage = JSON.parse(localStorage.getItem('habiflow-storage') || '{}');
                if (storage.state) {
                    storage.state.stats = data.stats;
                    localStorage.setItem('habiflow-storage', JSON.stringify(storage));
                }
            }

            window.location.reload(); // Reload to refresh store
        } catch (error) {
            console.error('Import failed:', error);
            throw error;
        }
    },

    downloadBackup(json: string) {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `habiflow_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};
