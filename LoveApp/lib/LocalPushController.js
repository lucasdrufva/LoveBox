import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  // (required) Called when a remote or local notification is opened or received
  onNotification: function (notification) {
    console.log('LOCAL NOTIFICATION ==>', notification);
  },
  popInitialNotification: true,
  requestPermissions: true,
});

export const LocalNotification = (data = 'Hej') => {
  console.log('Triggering a local notif');

  PushNotification.createChannel(
    {
      channelId: 'local', // (required)
      channelName: 'My channel', // (required)
      vibrate: true,
    },
    created => {
      console.log('maybecreated');
      PushNotification.localNotification({
        channelId: 'local',
        autoCancel: true,
        bigText: data,
        subText: 'Notification',
        title: 'New notification received',
        message: `Notif ID: ${data}`,
        vibrate: true,
        vibration: 300,
        playSound: true,
        soundName: 'default',
        ignoreInForeground: false,
        importance: 'high',
        invokeApp: true,
        allowWhileIdle: true,
        priority: 'high',
        visibility: 'public',
      });
    },
  );
};
