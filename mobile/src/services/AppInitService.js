/**
 * App Initialization Service
 *
 * Coordinates all services on app startup
 * Call this in App.js useEffect
 */

import PushNotificationService from './PushNotificationService';
import OfflineModeService from './OfflineModeService';
import VoiceSearchService from './VoiceSearchService';
import NetInfo from '@react-native-community/netinfo';
import { AppState } from 'react-native';

class AppInitService {
  constructor() {
    this.isInitialized = false;
    this.isOnline = true;
    this.unsubscribeNetInfo = null;
    this.appStateSubscription = null;
  }

  // Initialize all services
  async initialize() {
    if (this.isInitialized) {
      console.log('App already initialized');
      return;
    }

    try {
      console.log('🚀 Initializing app services...');

      // Initialize push notifications
      await this.initializePushNotifications();

      // Initialize voice search
      await this.initializeVoiceSearch();

      // Setup network monitoring
      this.setupNetworkMonitoring();

      // Setup app state monitoring
      this.setupAppStateMonitoring();

      // Clean expired cache
      await this.cleanCache();

      // Sync offline actions if online
      if (this.isOnline) {
        await this.syncOfflineActions();
      }

      this.isInitialized = true;
      console.log('✅ App initialization complete');
    } catch (error) {
      console.error('❌ App initialization error:', error);
    }
  }

  // Initialize push notifications
  async initializePushNotifications() {
    try {
      console.log('📱 Initializing push notifications...');
      await PushNotificationService.initialize();

      // Subscribe to relevant topics
      await PushNotificationService.subscribeToTopic('general');
      await PushNotificationService.subscribeToTopic('price_alerts');

      console.log('✅ Push notifications initialized');
    } catch (error) {
      console.error('Push notification init error:', error);
    }
  }

  // Initialize voice search
  async initializeVoiceSearch() {
    try {
      console.log('🎤 Initializing voice search...');
      const available = await VoiceSearchService.isAvailable();

      if (available) {
        console.log('✅ Voice search available');
      } else {
        console.log('⚠️ Voice search not available on this device');
      }
    } catch (error) {
      console.error('Voice search init error:', error);
    }
  }

  // Setup network monitoring
  setupNetworkMonitoring() {
    console.log('🌐 Setting up network monitoring...');

    this.unsubscribeNetInfo = NetInfo.addEventListener(state => {
      const wasOnline = this.isOnline;
      this.isOnline = state.isConnected && state.isInternetReachable;

      console.log(`Network status: ${this.isOnline ? 'Online' : 'Offline'}`);

      // If just came online, sync offline actions
      if (!wasOnline && this.isOnline) {
        console.log('🔄 Back online, syncing...');
        this.syncOfflineActions();
      }
    });
  }

  // Setup app state monitoring
  setupAppStateMonitoring() {
    console.log('📲 Setting up app state monitoring...');

    this.appStateSubscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        console.log('App came to foreground');
        // Refresh data when app comes to foreground
        this.onAppForeground();
      } else if (nextAppState === 'background') {
        console.log('App went to background');
        // Save state when app goes to background
        this.onAppBackground();
      }
    });
  }

  // Handle app coming to foreground
  async onAppForeground() {
    try {
      // Check for updates
      if (this.isOnline) {
        console.log('Checking for updates...');
        // TODO: Implement update check
      }

      // Clean expired cache
      await this.cleanCache();
    } catch (error) {
      console.error('App foreground handler error:', error);
    }
  }

  // Handle app going to background
  async onAppBackground() {
    try {
      // Save current state
      await OfflineModeService.updateLastSync();
      console.log('State saved');
    } catch (error) {
      console.error('App background handler error:', error);
    }
  }

  // Sync offline actions
  async syncOfflineActions() {
    try {
      const actions = await OfflineModeService.getOfflineActions();

      if (actions.length === 0) {
        console.log('No offline actions to sync');
        return;
      }

      console.log(`Syncing ${actions.length} offline actions...`);

      // TODO: Process each offline action
      for (const action of actions) {
        // Send action to backend
        console.log('Processing action:', action);
        // await processAction(action);
      }

      // Clear processed actions
      await OfflineModeService.clearOfflineActions();
      await OfflineModeService.updateLastSync();

      console.log('✅ Offline actions synced');
    } catch (error) {
      console.error('Sync offline actions error:', error);
    }
  }

  // Clean expired cache
  async cleanCache() {
    try {
      const removed = await OfflineModeService.cleanExpiredCache();
      if (removed > 0) {
        console.log(`🧹 Cleaned ${removed} expired cache items`);
      }
    } catch (error) {
      console.error('Clean cache error:', error);
    }
  }

  // Get network status
  isNetworkAvailable() {
    return this.isOnline;
  }

  // Get cache statistics
  async getCacheStats() {
    try {
      const stats = await OfflineModeService.getCacheSize();
      const lastSync = await OfflineModeService.getLastSync();
      const offlineActions = await OfflineModeService.getOfflineActions();

      return {
        ...stats,
        lastSync: lastSync ? new Date(lastSync).toLocaleString() : 'Never',
        pendingActions: offlineActions.length
      };
    } catch (error) {
      console.error('Get cache stats error:', error);
      return null;
    }
  }

  // Clear all data
  async clearAllData() {
    try {
      await OfflineModeService.clearAll();
      await PushNotificationService.deleteToken();
      console.log('All data cleared');
      return true;
    } catch (error) {
      console.error('Clear all data error:', error);
      return false;
    }
  }

  // Cleanup on app exit
  cleanup() {
    if (this.unsubscribeNetInfo) {
      this.unsubscribeNetInfo();
    }
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
    }
    PushNotificationService.cleanup();
    VoiceSearchService.destroy();
    console.log('App services cleaned up');
  }
}

export default new AppInitService();
