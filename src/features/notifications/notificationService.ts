export const notificationService = {
    async requestPermission(): Promise<boolean> {
        if (!('Notification' in window)) return false;
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    },

    async scheduleNotification(title: string, options: NotificationOptions) {
        if (Notification.permission !== 'granted') return;

        // In a real PWA, this would use Background Sync or a Service Worker
        // For now, we use the local notification API for immediate feedback
        new Notification(title, {
            icon: '/icons/icon-192.png',
            badge: '/icons/icon-192.png',
            ...options
        });
    },

    async sendSmartReminder(habitName: string) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        await this.scheduleNotification('HabiFlow Pro Reminder', {
            body: `It's ${time}. Time to complete your '${habitName}' habit and keep the streak alive!`,
            tag: 'habit-reminder'
        });
    }
};
