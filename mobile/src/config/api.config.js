import {Platform} from 'react-native';

// Development API URLs
const DEV_API_URL = Platform.select({
  android: 'http://10.0.2.2:5000/api', // Android emulator
  ios: 'http://localhost:5000/api', // iOS simulator
  default: 'http://localhost:5000/api',
});

// Production API URL (update with your actual production URL)
const PROD_API_URL = 'https://your-api.railway.app/api';

export const API_CONFIG = {
  baseURL: __DEV__ ? DEV_API_URL : PROD_API_URL,
  timeout: 30000,
};

export const RAZORPAY_KEY_ID = 'rzp_test_your_key_id';
export const GOOGLE_MAPS_API_KEY = 'your_google_maps_api_key';
