/**
 * Push Notification Service
 *
 * Handles Firebase Cloud Messaging for push notifications
 * @react-native-firebase/messaging is already installed!
 */

import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

class PushNotificationService {
  constructor() {
    this.fcmToken = null;
    this.unsubscribeOnMessage = null;
    this.unsubscribeOnNotificationOpenedApp = null;
  }

  // Initialize push notifications
  async initialize() {
    try {
      // Request permission (required for iOS, optional for Android)
      const authStatus = await this.requestUserPermission();

      if (authStatus) {
        console.log('Notification permission granted');

        // Get FCM token
        await this.getFCMToken();

        // Setup notification handlers
        this.setupNotificationHandlers();

        // Setup background handler
        this.setupBackgroundHandler();

        // Check initial notification (app opened from quit state)
        this.checkInitialNotification();
      } else {
        console.log('Notification permission denied');
      }
    } catch (error) {
      console.error('Push notification initialization error:', error);
    }
  }

  // Request notification permission
  async requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  }

  // Get FCM token
  async getFCMToken() {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      this.fcmToken = token;

      // Save token to AsyncStorage
      await AsyncStorage.setItem('fcmToken', token);

      // Send token to backend
      await this.sendTokenToBackend(token);

      return token;
    } catch (error) {
      console.error('Get FCM token error:', error);
      return null;
    }
  }

  // Send FCM token to backend
  async sendTokenToBackend(token) {
    try {
      // TODO: Implement API call to save token
      // const userToken = await AsyncStorage.getItem('userToken');
      // await axios.post('/api/users/fcm-token', { fcmToken: token }, {
      //   headers: { Authorization: `Bearer ${userToken}` }
      // });
      console.log('FCM token would be sent to backend:', token);
    } catch (error) {
      console.error('Send token to backend error:', error);
    }
  }

  // Setup notification handlers
  setupNotificationHandlers() {
    // Handle foreground notifications
    this.unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification:', remoteMessage);

      // Show local notification
      this.displayNotification(remoteMessage);
    });

    // Handle notification tap when app is in background
    this.unsubscribeOnNotificationOpenedApp = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened app from background:', remoteMessage);

      // Navigate to relevant screen
      this.handleNotificationNavigation(remoteMessage);
    });
  }

  // Setup background message handler
  setupBackgroundHandler() {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background notification:', remoteMessage);
      // Process notification in background
    });
  }

  // Check initial notification
  async checkInitialNotification() {
    const remoteMessage = await messaging().getInitialNotification();
    if (remoteMessage) {
      console.log('Notification opened app from quit state:', remoteMessage);
      this.handleNotificationNavigation(remoteMessage);
    }
  }

  // Display local notification
  displayNotification(remoteMessage) {
    // TODO: Use react-native-push-notification or similar
    // For now, just log
    console.log('Display notification:', {
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      data: remoteMessage.data
    });
  }

  // Handle notification navigation
  handleNotificationNavigation(remoteMessage) {
    const { data } = remoteMessage;

    if (data) {
      // Navigate based on notification type
      switch (data.type) {
        case 'price_drop':
          // Navigate to property detail
          console.log('Navigate to property:', data.propertyId);
          break;
        case 'new_match':
          // Navigate to property list with filters
          console.log('Navigate to new matches');
          break;
        case 'saved_search':
          // Navigate to search results
          console.log('Navigate to saved search results');
          break;
        case 'chat_message':
          // Navigate to chat
          console.log('Navigate to chat:', data.chatId);
          break;
        default:
          console.log('Unknown notification type:', data.type);
      }
    }
  }

  // Subscribe to topic
  async subscribeToTopic(topic) {
    try {
      await messaging().subscribeToTopic(topic);
      console.log(`Subscribed to topic: ${topic}`);
    } catch (error) {
      console.error('Subscribe to topic error:', error);
    }
  }

  // Unsubscribe from topic
  async unsubscribeFromTopic(topic) {
    try {
      await messaging().unsubscribeFromTopic(topic);
      console.log(`Unsubscribed from topic: ${topic}`);
    } catch (error) {
      console.error('Unsubscribe from topic error:', error);
    }
  }

  // Get badge count (iOS only)
  async getBadgeCount() {
    if (Platform.OS === 'ios') {
      try {
        const count = await messaging().getAPNSToken();
        return count || 0;
      } catch (error) {
        return 0;
      }
    }
    return 0;
  }

  // Set badge count (iOS only)
  async setBadgeCount(count) {
    if (Platform.OS === 'ios') {
      try {
        await messaging().setAPNSToken(count);
      } catch (error) {
        console.error('Set badge count error:', error);
      }
    }
  }

  // Delete FCM token
  async deleteToken() {
    try {
      await messaging().deleteToken();
      this.fcmToken = null;
      await AsyncStorage.removeItem('fcmToken');
      console.log('FCM token deleted');
    } catch (error) {
      console.error('Delete token error:', error);
    }
  }

  // Cleanup
  cleanup() {
    if (this.unsubscribeOnMessage) {
      this.unsubscribeOnMessage();
    }
    if (this.unsubscribeOnNotificationOpenedApp) {
      this.unsubscribeOnNotificationOpenedApp();
    }
  }

  // Send notification types
  notificationTypes = {
    PRICE_DROP: 'price_drop',
    NEW_MATCH: 'new_match',
    SAVED_SEARCH: 'saved_search',
    CHAT_MESSAGE: 'chat_message',
    PROPERTY_ALERT: 'property_alert',
    BOOKING_UPDATE: 'booking_update',
    SITE_VISIT_REMINDER: 'site_visit_reminder'
  };
}

export default new PushNotificationService();
