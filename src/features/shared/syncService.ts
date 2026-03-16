import { initDB } from '../../database/db';
import { SyncOperation } from '../../types';

export const syncService = {
    async addToQueue(type: 'CREATE' | 'UPDATE' | 'DELETE', table: 'habits' | 'logs', payload: any) {
        const db = await initDB();
        const op: SyncOperation = {
            id: typeof crypto.randomUUID !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).substring(2),
            type,
            table,
            payload,
            timestamp: Date.now()
        };
        await db.put('syncQueue', op);
        this.processQueue(); // Attempt to process immediately
    },

    async processQueue() {
        const db = await initDB();
        const ops = await db.getAllFromIndex('syncQueue', 'by-timestamp');

        if (ops.length === 0) return;

        console.log(`Syncing ${ops.length} operations...`);

        // Simulate API calls
        for (const op of ops) {
            try {
                // Here you would call await fetch('/api/sync', ...)
                console.log(`Synced: ${op.type} on ${op.table}`, op.payload);
                await db.delete('syncQueue', op.id);
            } catch (e) {
                console.error('Sync failed for operation:', op.id);
                break; // Stop processing if offline or error
            }
        }
    }
};
