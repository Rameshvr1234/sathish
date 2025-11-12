# Mobile App Development Guide

Complete guide for building iOS and Android mobile apps for the Real Estate Portal using React Native.

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Setup Instructions](#setup-instructions)
4. [Project Structure](#project-structure)
5. [Core Components](#core-components)
6. [API Integration](#api-integration)
7. [Navigation](#navigation)
8. [State Management](#state-management)
9. [Platform-Specific Features](#platform-specific-features)
10. [Build & Deployment](#build--deployment)

---

## Overview

The mobile app will provide native iOS and Android experiences while sharing business logic with the web application through the same backend API.

**Key Features:**
- Native performance with React Native
- Shared Redux state management logic
- Cross-platform component library
- Push notifications
- Camera integration for property photos
- Location services for property search
- Offline mode with local storage
- Deep linking support

---

## Technology Stack

```json
{
  "react-native": "^0.73.0",
  "react-navigation": "^6.0.0",
  "redux-toolkit": "^2.0.0",
  "react-native-paper": "^5.0.0",
  "axios": "^1.6.0",
  "socket.io-client": "^4.6.0",
  "react-native-image-picker": "^7.0.0",
  "react-native-maps": "^1.10.0",
  "@react-native-async-storage/async-storage": "^1.21.0",
  "react-native-push-notification": "^8.1.1"
}
```

**Development Tools:**
- React Native CLI or Expo
- Android Studio (for Android)
- Xcode (for iOS - macOS only)
- Flipper for debugging

---

## Setup Instructions

### 1. Prerequisites

**For React Native CLI:**

```bash
# Install Node.js (v18+)
node --version

# Install Watchman (macOS)
brew install watchman

# Install JDK (for Android)
brew install --cask adoptopenjdk/openjdk/adoptopenjdk11

# Install Android Studio
# Download from: https://developer.android.com/studio

# Install Xcode (macOS only - for iOS)
# Download from App Store
```

### 2. Create React Native Project

```bash
# Using React Native CLI (recommended for this project)
npx react-native@latest init RealEstateApp
cd RealEstateApp

# OR using Expo (easier but less control)
npx create-expo-app RealEstateApp
cd RealEstateApp
```

### 3. Install Dependencies

```bash
# Core dependencies
npm install @reduxjs/toolkit react-redux
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install axios socket.io-client
npm install react-native-paper react-native-vector-icons
npm install @react-native-async-storage/async-storage

# Media & Location
npm install react-native-image-picker
npm install react-native-maps
npm install @react-native-community/geolocation

# Notifications
npm install @react-native-firebase/app @react-native-firebase/messaging

# iOS only
cd ios && pod install && cd ..
```

### 4. Configure API Base URL

Create `src/config/api.config.js`:

```javascript
export const API_CONFIG = {
  baseURL: __DEV__
    ? 'http://localhost:5000/api'  // Development
    : 'https://your-api.railway.app/api',  // Production
  timeout: 30000,
}
```

---

## Project Structure

```
RealEstateApp/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Loading.jsx
│   │   ├── property/
│   │   │   ├── PropertyCard.jsx
│   │   │   ├── PropertyList.jsx
│   │   │   └── FilterSheet.jsx
│   │   └── chat/
│   │       └── MessageBubble.jsx
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.jsx
│   │   │   └── RegisterScreen.jsx
│   │   ├── home/
│   │   │   └── HomeScreen.jsx
│   │   ├── property/
│   │   │   ├── PropertyListScreen.jsx
│   │   │   ├── PropertyDetailScreen.jsx
│   │   │   └── CreatePropertyScreen.jsx
│   │   ├── services/
│   │   │   └── ServiceBookingScreen.jsx
│   │   ├── chat/
│   │   │   └── ChatScreen.jsx
│   │   └── profile/
│   │       └── ProfileScreen.jsx
│   ├── navigation/
│   │   ├── AppNavigator.jsx
│   │   └── AuthNavigator.jsx
│   ├── redux/
│   │   ├── store.js
│   │   └── slices/
│   │       ├── authSlice.js       # Shared with web
│   │       ├── propertySlice.js   # Shared with web
│   │       └── chatSlice.js       # Shared with web
│   ├── utils/
│   │   ├── api.js
│   │   ├── storage.js
│   │   └── notifications.js
│   ├── config/
│   │   └── api.config.js
│   └── App.jsx
├── android/
├── ios/
└── package.json
```

---

## Core Components

### 1. Button Component

`src/components/common/Button.jsx`:

```javascript
import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native'

const Button = ({ title, onPress, loading, variant = 'primary', style, disabled }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' ? styles.primary : styles.secondary,
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#1890ff',
  },
  secondary: {
    backgroundColor: '#f0f0f0',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})

export default Button
```

### 2. Property Card Component

`src/components/property/PropertyCard.jsx`:

```javascript
import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const PropertyCard = ({ property, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: property.images?.[0] || 'https://via.placeholder.com/300' }}
        style={styles.image}
      />

      {property.sv_verified && (
        <View style={styles.verifiedBadge}>
          <Icon name="check-decagram" size={16} color="#fff" />
          <Text style={styles.verifiedText}>SV Verified</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {property.title}
        </Text>

        <View style={styles.locationRow}>
          <Icon name="map-marker" size={16} color="#666" />
          <Text style={styles.location}>{property.location}</Text>
        </View>

        <View style={styles.detailsRow}>
          <Text style={styles.price}>₹{(property.price / 100000).toFixed(1)}L</Text>
          <Text style={styles.area}>{property.area} sq.ft</Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.type}>{property.property_type}</Text>
          <Text style={styles.purpose}>{property.purpose}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#52c41a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  verifiedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1890ff',
  },
  area: {
    fontSize: 14,
    color: '#666',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  type: {
    fontSize: 12,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    color: '#595959',
  },
  purpose: {
    fontSize: 12,
    backgroundColor: '#e6f7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    color: '#1890ff',
  },
})

export default PropertyCard
```

---

## API Integration

### Setup Axios Instance

`src/utils/api.js`:

```javascript
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_CONFIG } from '../config/api.config'

const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token')
      // Navigate to login - handled in Redux actions
    }
    return Promise.reject(error)
  }
)

export default api
```

### Storage Utility

`src/utils/storage.js`:

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage'

export const storage = {
  async setToken(token) {
    await AsyncStorage.setItem('token', token)
  },

  async getToken() {
    return await AsyncStorage.getItem('token')
  },

  async removeToken() {
    await AsyncStorage.removeItem('token')
  },

  async setUser(user) {
    await AsyncStorage.setItem('user', JSON.stringify(user))
  },

  async getUser() {
    const user = await AsyncStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  async clearAll() {
    await AsyncStorage.clear()
  },
}
```

---

## Navigation

### App Navigator

`src/navigation/AppNavigator.jsx`:

```javascript
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

// Screens
import LoginScreen from '../screens/auth/LoginScreen'
import RegisterScreen from '../screens/auth/RegisterScreen'
import HomeScreen from '../screens/home/HomeScreen'
import PropertyListScreen from '../screens/property/PropertyListScreen'
import PropertyDetailScreen from '../screens/property/PropertyDetailScreen'
import CreatePropertyScreen from '../screens/property/CreatePropertyScreen'
import ChatScreen from '../screens/chat/ChatScreen'
import ProfileScreen from '../screens/profile/ProfileScreen'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === 'Home') iconName = 'home'
          else if (route.name === 'Properties') iconName = 'home-city'
          else if (route.name === 'Chat') iconName = 'message'
          else if (route.name === 'Profile') iconName = 'account'

          return <Icon name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: '#1890ff',
        tabBarInactiveTintColor: '#8c8c8c',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Properties" component={PropertyListScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

const AppNavigator = () => {
  const { isAuthenticated } = useSelector((state) => state.auth)

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="PropertyDetail" component={PropertyDetailScreen} />
            <Stack.Screen name="CreateProperty" component={CreatePropertyScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
```

---

## State Management

### Redux Store Setup

`src/redux/store.js`:

```javascript
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import propertyReducer from './slices/propertySlice'
import chatReducer from './slices/chatSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    property: propertyReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
```

### Auth Slice (Mobile Version)

`src/redux/slices/authSlice.js`:

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'
import { storage } from '../../utils/storage'

export const login = createAsyncThunk('auth/login', async (credentials) => {
  const response = await api.post('/auth/login', credentials)
  await storage.setToken(response.data.token)
  await storage.setUser(response.data.user)
  return response.data
})

export const register = createAsyncThunk('auth/register', async (userData) => {
  const response = await api.post('/auth/register', userData)
  await storage.setToken(response.data.token)
  await storage.setUser(response.data.user)
  return response.data
})

export const logout = createAsyncThunk('auth/logout', async () => {
  await storage.clearAll()
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    restoreAuth: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.token = action.payload.token
        state.user = action.payload.user
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
  },
})

export const { restoreAuth } = authSlice.actions
export default authSlice.reducer
```

---

## Platform-Specific Features

### 1. Camera Integration

```javascript
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'

export const pickImage = async () => {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    quality: 0.8,
    maxWidth: 1200,
    maxHeight: 1200,
    selectionLimit: 5,
  })

  if (!result.didCancel && !result.error) {
    return result.assets
  }
  return null
}

export const takePhoto = async () => {
  const result = await launchCamera({
    mediaType: 'photo',
    quality: 0.8,
    maxWidth: 1200,
    maxHeight: 1200,
  })

  if (!result.didCancel && !result.error) {
    return result.assets[0]
  }
  return null
}
```

### 2. Push Notifications

`src/utils/notifications.js`:

```javascript
import messaging from '@react-native-firebase/messaging'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission()
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL

  if (enabled) {
    const token = await messaging().getToken()
    await AsyncStorage.setItem('fcm_token', token)
    return token
  }
}

export const setupNotifications = () => {
  // Foreground messages
  messaging().onMessage(async (remoteMessage) => {
    console.log('Notification received in foreground:', remoteMessage)
    // Show local notification
  })

  // Background messages
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Background notification:', remoteMessage)
  })
}
```

### 3. Location Services

```javascript
import Geolocation from '@react-native-community/geolocation'
import { PermissionsAndroid, Platform } from 'react-native'

export const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    )
    return granted === PermissionsAndroid.RESULTS.GRANTED
  }
  return true
}

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    )
  })
}
```

---

## Build & Deployment

### Android Build

```bash
# Development build
npx react-native run-android

# Release build
cd android
./gradlew assembleRelease

# Output APK location:
# android/app/build/outputs/apk/release/app-release.apk

# Generate signed AAB for Play Store
./gradlew bundleRelease
# android/app/build/outputs/bundle/release/app-release.aab
```

### iOS Build

```bash
# Development build
npx react-native run-ios

# Or specific device
npx react-native run-ios --device "iPhone 14"

# Release build (in Xcode)
# 1. Open ios/RealEstateApp.xcworkspace
# 2. Select "Any iOS Device" as target
# 3. Product > Archive
# 4. Upload to App Store Connect
```

### Environment Configuration

**Android (`android/app/build.gradle`):**

```gradle
android {
    defaultConfig {
        // ...
        buildConfigField "String", "API_URL", "\"https://your-api.railway.app/api\""
    }

    buildTypes {
        debug {
            buildConfigField "String", "API_URL", "\"http://10.0.2.2:5000/api\""
        }
        release {
            buildConfigField "String", "API_URL", "\"https://your-api.railway.app/api\""
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

**iOS (`ios/RealEstateApp/Info.plist`):**

```xml
<key>API_URL</key>
<string>$(API_URL)</string>
```

---

## Testing

### Unit Tests with Jest

```javascript
// __tests__/components/PropertyCard.test.js
import React from 'react'
import { render } from '@testing-library/react-native'
import PropertyCard from '../src/components/property/PropertyCard'

describe('PropertyCard', () => {
  const mockProperty = {
    id: 1,
    title: 'Test Property',
    price: 5000000,
    area: 1200,
    location: 'Coimbatore',
    property_type: 'Apartment',
    purpose: 'Sale',
    sv_verified: true,
    images: ['https://example.com/image.jpg'],
  }

  it('renders property details correctly', () => {
    const { getByText } = render(<PropertyCard property={mockProperty} onPress={() => {}} />)
    expect(getByText('Test Property')).toBeTruthy()
    expect(getByText('₹50.0L')).toBeTruthy()
    expect(getByText('SV Verified')).toBeTruthy()
  })
})
```

### E2E Tests with Detox

```bash
# Install Detox
npm install --save-dev detox

# Configure and run
detox test --configuration ios.sim.debug
```

---

## Optimization Tips

1. **Image Optimization:**
   - Use `react-native-fast-image` for better caching
   - Compress images before upload
   - Use CDN for property images

2. **Performance:**
   - Use `React.memo` for list items
   - Implement `FlatList` with `windowSize` optimization
   - Enable Hermes engine for faster startup

3. **Offline Support:**
   - Cache API responses with Redux Persist
   - Store viewed properties locally
   - Queue actions for when network returns

4. **Bundle Size:**
   - Use ProGuard (Android) and bitcode (iOS)
   - Remove unused dependencies
   - Enable code splitting where possible

---

## Next Steps

1. **Phase 1 (Weeks 1-2):**
   - Setup project and navigation
   - Implement authentication screens
   - Create common components

2. **Phase 2 (Weeks 3-4):**
   - Property list and detail screens
   - Filter implementation
   - Image upload functionality

3. **Phase 3 (Weeks 5-6):**
   - Chat functionality
   - Service booking screens
   - Push notifications

4. **Phase 4 (Weeks 7-8):**
   - Admin dashboards
   - Testing and bug fixes
   - App Store / Play Store submission

---

## Resources

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Firebase Cloud Messaging](https://rnfirebase.io/messaging/usage)

---

**Happy Mobile Development!** 🚀📱
