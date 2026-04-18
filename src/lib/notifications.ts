export function scheduleLocalNotification(id: string, title: string, message: string, time: string) {
  console.log(`Scheduling notification [${id}]: ${title} at ${time}`);
  
  // Request Web Notification permission as a fallback
  if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
     Notification.requestPermission();
  }

  // Convert time string (e.g. "14:30") to schedule datetime
  const [hours, minutes] = time.split(':').map(Number);
  const scheduleDate = new Date();
  scheduleDate.setHours(hours, minutes, 0, 0);
  
  // If time already passed today, schedule for tomorrow
  if (scheduleDate.getTime() < new Date().getTime()) {
     scheduleDate.setDate(scheduleDate.getDate() + 1);
  }

  // 1. OneSignal Tags (Schedule via tags if server supports it, though usually local is best)
  if (window.OneSignalDeferred) {
     window.OneSignalDeferred.push(async function(OneSignal: any) {
        // Tag user with reminder info as a generic web implementation
        await OneSignal.User.addTag(`reminder_${id}`, time);
     });
  }

  // 2. Median JS Bridge for Native Local Notification
  try {
    if (window.median) {
      // Use Median's localPush plugin to schedule a native notification
      if (window.median.localPush) {
        window.median.localPush.schedule({
            id: id, // unique ID to cancel later if needed
            title: title || 'تذكير',
            message: message,
            date: scheduleDate.getTime() // Unix timestamp in ms
        });
      } else {
        // Fallback for some generic Median commands
        window.location.href = `median://onesignal/tags?tags=` + encodeURIComponent(JSON.stringify({[`reminder_${id}`]: time}));
      }
    }
  } catch (e) {
     console.error('Median bridge notification error', e);
  }
}

export function cancelLocalNotification(id: string) {
  try {
    if (window.median && window.median.localPush) {
      window.median.localPush.cancel(id);
    }
  } catch (e) {
    console.error('Error canceling notification', e);
  }
}

// Add TS declarations for the window object
declare global {
  interface Window {
    OneSignalDeferred: any[];
    median: any;
  }
}
