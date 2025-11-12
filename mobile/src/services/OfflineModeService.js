/**
 * Offline Mode Service
 *
 * Caches data locally using AsyncStorage for offline access
 * @react-native-async-storage/async-storage is already installed!
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

class OfflineModeService {
  constructor() {
    this.CACHE_PREFIX = '@RealEstateApp:';
    this.CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days
  }

  // Storage keys
  keys = {
    RECENTLY_VIEWED: 'recently_viewed',
    SAVED_PROPERTIES: 'saved_properties',
    PROPERTY_CACHE: 'property_cache',
    SEARCH_HISTORY: 'search_history',
    USER_PREFERENCES: 'user_preferences',
    OFFLINE_ACTIONS: 'offline_actions',
    LAST_SYNC: 'last_sync'
  };

  // Get item from cache
  async getItem(key) {
    try {
      const cacheKey = this.CACHE_PREFIX + key;
      const item = await AsyncStorage.getItem(cacheKey);

      if (!item) {
        return null;
      }

      const parsed = JSON.parse(item);

      // Check if expired
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        await this.removeItem(key);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.error('Get item error:', error);
      return null;
    }
  }

  // Set item to cache
  async setItem(key, data, expiryMs = this.CACHE_EXPIRY) {
    try {
      const cacheKey = this.CACHE_PREFIX + key;
      const item = {
        data,
        expiresAt: expiryMs ? Date.now() + expiryMs : null,
        cachedAt: Date.now()
      };

      await AsyncStorage.setItem(cacheKey, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error('Set item error:', error);
      return false;
    }
  }

  // Remove item from cache
  async removeItem(key) {
    try {
      const cacheKey = this.CACHE_PREFIX + key;
      await AsyncStorage.removeItem(cacheKey);
      return true;
    } catch (error) {
      console.error('Remove item error:', error);
      return false;
    }
  }

  // Clear all cache
  async clearAll() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith(this.CACHE_PREFIX));
      await AsyncStorage.multiRemove(appKeys);
      console.log('Cache cleared');
      return true;
    } catch (error) {
      console.error('Clear all error:', error);
      return false;
    }
  }

  // Cache property details
  async cacheProperty(property) {
    try {
      const cached = await this.getItem(this.keys.PROPERTY_CACHE) || {};
      cached[property.id] = {
        ...property,
        cachedAt: Date.now()
      };

      await this.setItem(this.keys.PROPERTY_CACHE, cached);
      return true;
    } catch (error) {
      console.error('Cache property error:', error);
      return false;
    }
  }

  // Get cached property
  async getCachedProperty(propertyId) {
    try {
      const cached = await this.getItem(this.keys.PROPERTY_CACHE) || {};
      return cached[propertyId] || null;
    } catch (error) {
      console.error('Get cached property error:', error);
      return null;
    }
  }

  // Cache recently viewed properties
  async addRecentlyViewed(property) {
    try {
      const viewed = await this.getItem(this.keys.RECENTLY_VIEWED) || [];

      // Remove if already exists
      const filtered = viewed.filter(p => p.id !== property.id);

      // Add to beginning
      filtered.unshift({
        ...property,
        viewedAt: Date.now()
      });

      // Keep only last 50
      const limited = filtered.slice(0, 50);

      await this.setItem(this.keys.RECENTLY_VIEWED, limited);
      return true;
    } catch (error) {
      console.error('Add recently viewed error:', error);
      return false;
    }
  }

  // Get recently viewed properties
  async getRecentlyViewed(limit = 20) {
    try {
      const viewed = await this.getItem(this.keys.RECENTLY_VIEWED) || [];
      return viewed.slice(0, limit);
    } catch (error) {
      console.error('Get recently viewed error:', error);
      return [];
    }
  }

  // Clear recently viewed
  async clearRecentlyViewed() {
    return await this.removeItem(this.keys.RECENTLY_VIEWED);
  }

  // Cache saved/shortlisted properties
  async addSavedProperty(property) {
    try {
      const saved = await this.getItem(this.keys.SAVED_PROPERTIES) || [];

      // Check if already saved
      const exists = saved.find(p => p.id === property.id);
      if (!exists) {
        saved.push({
          ...property,
          savedAt: Date.now()
        });
        await this.setItem(this.keys.SAVED_PROPERTIES, saved);
      }

      return true;
    } catch (error) {
      console.error('Add saved property error:', error);
      return false;
    }
  }

  // Remove saved property
  async removeSavedProperty(propertyId) {
    try {
      const saved = await this.getItem(this.keys.SAVED_PROPERTIES) || [];
      const filtered = saved.filter(p => p.id !== propertyId);
      await this.setItem(this.keys.SAVED_PROPERTIES, filtered);
      return true;
    } catch (error) {
      console.error('Remove saved property error:', error);
      return false;
    }
  }

  // Get saved properties
  async getSavedProperties() {
    try {
      return await this.getItem(this.keys.SAVED_PROPERTIES) || [];
    } catch (error) {
      console.error('Get saved properties error:', error);
      return [];
    }
  }

  // Check if property is saved
  async isPropertySaved(propertyId) {
    try {
      const saved = await this.getSavedProperties();
      return saved.some(p => p.id === propertyId);
    } catch (error) {
      return false;
    }
  }

  // Add search to history
  async addSearchHistory(query, filters = {}) {
    try {
      const history = await this.getItem(this.keys.SEARCH_HISTORY) || [];

      const newSearch = {
        query,
        filters,
        searchedAt: Date.now()
      };

      // Remove duplicate
      const filtered = history.filter(
        h => h.query !== query || JSON.stringify(h.filters) !== JSON.stringify(filters)
      );

      // Add to beginning
      filtered.unshift(newSearch);

      // Keep only last 20
      const limited = filtered.slice(0, 20);

      await this.setItem(this.keys.SEARCH_HISTORY, limited);
      return true;
    } catch (error) {
      console.error('Add search history error:', error);
      return false;
    }
  }

  // Get search history
  async getSearchHistory(limit = 10) {
    try {
      const history = await this.getItem(this.keys.SEARCH_HISTORY) || [];
      return history.slice(0, limit);
    } catch (error) {
      console.error('Get search history error:', error);
      return [];
    }
  }

  // Clear search history
  async clearSearchHistory() {
    return await this.removeItem(this.keys.SEARCH_HISTORY);
  }

  // Save user preferences
  async savePreferences(preferences) {
    try {
      await this.setItem(this.keys.USER_PREFERENCES, preferences, null); // No expiry
      return true;
    } catch (error) {
      console.error('Save preferences error:', error);
      return false;
    }
  }

  // Get user preferences
  async getPreferences() {
    try {
      return await this.getItem(this.keys.USER_PREFERENCES) || {};
    } catch (error) {
      console.error('Get preferences error:', error);
      return {};
    }
  }

  // Queue offline action
  async queueOfflineAction(action) {
    try {
      const actions = await this.getItem(this.keys.OFFLINE_ACTIONS) || [];
      actions.push({
        ...action,
        queuedAt: Date.now()
      });
      await this.setItem(this.keys.OFFLINE_ACTIONS, actions, null);
      return true;
    } catch (error) {
      console.error('Queue offline action error:', error);
      return false;
    }
  }

  // Get offline actions
  async getOfflineActions() {
    try {
      return await this.getItem(this.keys.OFFLINE_ACTIONS) || [];
    } catch (error) {
      console.error('Get offline actions error:', error);
      return [];
    }
  }

  // Clear offline actions
  async clearOfflineActions() {
    return await this.removeItem(this.keys.OFFLINE_ACTIONS);
  }

  // Update last sync time
  async updateLastSync() {
    try {
      await this.setItem(this.keys.LAST_SYNC, Date.now(), null);
      return true;
    } catch (error) {
      console.error('Update last sync error:', error);
      return false;
    }
  }

  // Get last sync time
  async getLastSync() {
    try {
      return await this.getItem(this.keys.LAST_SYNC);
    } catch (error) {
      console.error('Get last sync error:', error);
      return null;
    }
  }

  // Get cache size (approximate)
  async getCacheSize() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith(this.CACHE_PREFIX));

      let totalSize = 0;
      for (const key of appKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += new Blob([value]).size;
        }
      }

      return {
        items: appKeys.length,
        sizeBytes: totalSize,
        sizeMB: (totalSize / (1024 * 1024)).toFixed(2)
      };
    } catch (error) {
      console.error('Get cache size error:', error);
      return { items: 0, sizeBytes: 0, sizeMB: 0 };
    }
  }

  // Remove expired items
  async cleanExpiredCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith(this.CACHE_PREFIX));

      let removedCount = 0;

      for (const key of appKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          const parsed = JSON.parse(value);
          if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
            await AsyncStorage.removeItem(key);
            removedCount++;
          }
        }
      }

      console.log(`Removed ${removedCount} expired items`);
      return removedCount;
    } catch (error) {
      console.error('Clean expired cache error:', error);
      return 0;
    }
  }
}

export default new OfflineModeService();
