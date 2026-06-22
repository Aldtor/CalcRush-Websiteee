import { LocalNotifications } from '@capacitor/local-notifications';

export async function requestNotificationPermission() {
  try {
    const status = await LocalNotifications.checkPermissions();
    if (status.display === 'granted') {
      return true;
    }
    const request = await LocalNotifications.requestPermissions();
    return request.display === 'granted';
  } catch (e) {
    console.error('Notification Permission Error', e);
    // Return true for web environment if web Notifications API is granted, or just fallback
    if ('Notification' in window) {
      if (Notification.permission === 'granted') return true;
      const res = await Notification.requestPermission();
      return res === 'granted';
    }
    return false;
  }
}

export async function scheduleDailyReminder() {
  try {
    // Cancel existing reminder first to prevent duplicates
    await cancelDailyReminder();

    const granted = await requestNotificationPermission();
    if (!granted) {
      console.log('Notification permission not granted. Daily reminder skipped.');
      return false;
    }

    // Schedule daily reminder at 7:00 PM (19:00)
    await LocalNotifications.schedule({
      notifications: [
        {
          title: "Math practice time! 🚀",
          body: "Keep your daily CalcRush streak going! Spend 2 minutes practicing math now.",
          id: 101, // Unique ID for daily reminder
          schedule: {
            on: {
              hour: 19, // 7:00 PM
              minute: 0,
            },
            repeats: true,
            allowWhileIdle: true
          }
        }
      ]
    });
    console.log('Daily reminder scheduled for 7:00 PM.');
    return true;
  } catch (e) {
    console.error('Error scheduling daily reminder', e);
    
    // Web Fallback (non-repeating, or simulated)
    if ('Notification' in window && Notification.permission === 'granted') {
      console.log('Web environment fallback: local notifications not fully supported, using console log/localStorage markers.');
    }
    return false;
  }
}

export async function cancelDailyReminder() {
  try {
    await LocalNotifications.cancel({
      notifications: [{ id: 101 }]
    });
    console.log('Daily reminder cancelled.');
  } catch (e) {
    console.error('Error cancelling daily reminder', e);
  }
}
