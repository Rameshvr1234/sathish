import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  async setToken(token) {
    await AsyncStorage.setItem('token', token);
  },

  async getToken() {
    return await AsyncStorage.getItem('token');
  },

  async removeToken() {
    await AsyncStorage.removeItem('token');
  },

  async setUser(user) {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  },

  async getUser() {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  async removeUser() {
    await AsyncStorage.removeItem('user');
  },

  async clearAll() {
    await AsyncStorage.clear();
  },

  // Saved properties
  async getSavedProperties() {
    const saved = await AsyncStorage.getItem('saved_properties');
    return saved ? JSON.parse(saved) : [];
  },

  async saveProperty(propertyId) {
    const saved = await this.getSavedProperties();
    if (!saved.includes(propertyId)) {
      saved.push(propertyId);
      await AsyncStorage.setItem('saved_properties', JSON.stringify(saved));
    }
  },

  async unsaveProperty(propertyId) {
    const saved = await this.getSavedProperties();
    const filtered = saved.filter(id => id !== propertyId);
    await AsyncStorage.setItem('saved_properties', JSON.stringify(filtered));
  },
};
