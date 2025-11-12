# Real Estate Portal - Mobile App

React Native mobile application for the Real Estate Portal.

## Features

- 🔐 Authentication (Login/Register)
- 🏘️ Property browsing with filters
- 🔍 Property search by region, location, type
- 📋 Property details with image gallery
- 📱 Call and WhatsApp integration
- 💼 Service bookings (Survey, Legal, Construction, Finance)
- 👤 User profile management
- ❤️ Save favorite properties
- 📲 Push notifications (Firebase)
- 📍 Location services
- 📷 Camera integration for property photos

## Technology Stack

- **React Native** 0.73.2
- **React Navigation** v6
- **Redux Toolkit** for state management
- **Axios** for API calls
- **Socket.io Client** for real-time chat
- **React Native Vector Icons** for icons
- **React Native Image Picker** for camera/gallery
- **React Native Maps** for location
- **Firebase** for push notifications
- **Razorpay** for payments

## Prerequisites

- Node.js 18+
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS - macOS only)
- JDK 11+ (for Android)

## Setup Instructions

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your API URL and keys
```

### 3. iOS Setup (macOS only)

```bash
cd ios
pod install
cd ..
```

### 4. Run the App

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

## Project Structure

```
mobile/
├── src/
│   ├── components/          # Reusable components
│   │   ├── common/          # Button, Input, Card, Loading
│   │   └── property/        # PropertyCard
│   ├── screens/             # App screens
│   │   ├── auth/            # Login, Register
│   │   ├── home/            # Home screen
│   │   ├── property/        # Property List, Detail
│   │   ├── services/        # Service booking
│   │   ├── profile/         # User profile
│   │   └── chat/            # Chat interface
│   ├── navigation/          # Navigation setup
│   │   └── AppNavigator.jsx # Main navigator
│   ├── redux/               # State management
│   │   ├── store.js
│   │   └── slices/          # Auth, Property, Service, Chat
│   ├── utils/               # Utilities
│   │   ├── api.js           # Axios configuration
│   │   ├── storage.js       # AsyncStorage wrapper
│   │   ├── notifications.js # Push notifications
│   │   ├── location.js      # Location services
│   │   └── imagePicker.js   # Camera/Gallery
│   ├── config/              # Configuration
│   │   └── api.config.js    # API URLs
│   └── App.jsx              # Root component
├── android/                 # Android native code
├── ios/                     # iOS native code
├── index.js                 # Entry point
├── package.json
└── README.md
```

## Available Scripts

- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm start` - Start Metro bundler
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run clean` - Clean build artifacts

## API Integration

The app connects to the backend API at:
- **Development**: `http://10.0.2.2:5000/api` (Android) or `http://localhost:5000/api` (iOS)
- **Production**: Configured in `.env` file

### API Configuration

Edit `src/config/api.config.js` to update API URLs:

```javascript
export const API_CONFIG = {
  baseURL: __DEV__ ? DEV_API_URL : PROD_API_URL,
  timeout: 30000,
};
```

## Redux State Management

### Slices:

1. **authSlice** - Authentication state
   - login, register, logout
   - User profile management

2. **propertySlice** - Property data
   - Fetch properties with filters
   - Property details
   - My properties
   - Regions and locations

3. **serviceSlice** - Service bookings
   - Book services (Survey, Legal, Construction, Finance)
   - My service bookings

4. **chatSlice** - Chat functionality
   - Conversations
   - Messages
   - Real-time updates

## Firebase Setup (Push Notifications)

### Android

1. Download `google-services.json` from Firebase Console
2. Place it in `android/app/`
3. Update `android/build.gradle` with Firebase dependencies

### iOS

1. Download `GoogleService-Info.plist` from Firebase Console
2. Add it to Xcode project
3. Enable Push Notifications capability in Xcode

## Building for Production

### Android

```bash
cd android
./gradlew assembleRelease

# Output APK:
# android/app/build/outputs/apk/release/app-release.apk

# For Play Store (AAB):
./gradlew bundleRelease
# android/app/build/outputs/bundle/release/app-release.aab
```

### iOS

1. Open `ios/RealEstateApp.xcworkspace` in Xcode
2. Select "Any iOS Device" as target
3. Product → Archive
4. Distribute to App Store

## Features Implementation Status

✅ Implemented:
- Authentication (Login/Register)
- Property browsing and filtering
- Property details view
- Home screen with services
- User profile
- Redux state management
- API integration
- Navigation setup

🚧 To be implemented:
- Service booking forms
- Chat functionality
- Property creation
- My Properties screen
- Camera integration (prepared)
- Push notifications (configured)
- Payment integration (Razorpay)
- Site visit booking

## Troubleshooting

### Android Emulator Can't Connect to API

Use `10.0.2.2` instead of `localhost`:
```javascript
baseURL: 'http://10.0.2.2:5000/api'
```

### iOS Build Failed

```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

### Metro Bundler Issues

```bash
npm start -- --reset-cache
```

### Clear Everything

```bash
npm run clean
rm -rf node_modules
npm install
cd ios && pod install && cd ..
```

## Environment Variables

Create `.env` file:

```env
API_URL=http://10.0.2.2:5000/api
RAZORPAY_KEY_ID=rzp_test_your_key_id
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_PROJECT_ID=your_project_id
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

## Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run E2E tests (Detox)
npm run test:e2e
```

## Deployment

### App Store (iOS)

1. Build archive in Xcode
2. Upload to App Store Connect
3. Submit for review

### Play Store (Android)

1. Generate signed AAB
2. Upload to Play Console
3. Submit for review

## Contributing

1. Create feature branch
2. Make changes
3. Test on both iOS and Android
4. Submit pull request

## License

Private - Real Estate Portal

## Support

For issues and questions, refer to the main project documentation or contact the development team.

---

**Happy Mobile Development!** 📱🚀
