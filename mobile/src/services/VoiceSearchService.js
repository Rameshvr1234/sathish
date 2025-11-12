/**
 * Voice Search Service
 *
 * Provides voice recognition for property search
 *
 * SETUP INSTRUCTIONS:
 * 1. Install: npm install @react-native-voice/voice
 * 2. iOS: cd ios && pod install
 * 3. Android: Add permissions to AndroidManifest.xml:
 *    <uses-permission android:name="android.permission.RECORD_AUDIO" />
 * 4. Request runtime permissions before use
 */

// Uncomment when @react-native-voice/voice is installed
// import Voice from '@react-native-voice/voice';
import { Platform, PermissionsAndroid } from 'react-native';

class VoiceSearchService {
  constructor() {
    this.isListening = false;
    this.results = [];
    this.error = null;

    // Uncomment when Voice is available
    // this.initializeVoice();
  }

  // Initialize voice recognition
  initializeVoice() {
    // Voice.onSpeechStart = this.onSpeechStart.bind(this);
    // Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
    // Voice.onSpeechResults = this.onSpeechResults.bind(this);
    // Voice.onSpeechError = this.onSpeechError.bind(this);
  }

  onSpeechStart(e) {
    console.log('Voice recognition started');
    this.isListening = true;
  }

  onSpeechEnd(e) {
    console.log('Voice recognition ended');
    this.isListening = false;
  }

  onSpeechResults(e) {
    console.log('Voice results:', e.value);
    this.results = e.value;
  }

  onSpeechError(e) {
    console.error('Voice error:', e.error);
    this.error = e.error;
    this.isListening = false;
  }

  // Request microphone permissions
  async requestPermissions() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'This app needs access to your microphone for voice search',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Permission error:', err);
        return false;
      }
    }
    return true; // iOS handles permissions automatically
  }

  // Start voice recognition
  async startListening(callback) {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Microphone permission denied');
      }

      this.error = null;
      this.results = [];

      // Uncomment when Voice is available
      // await Voice.start('en-US');

      // Mock implementation for now
      console.log('Voice search would start here');
      if (callback) {
        callback({ status: 'started' });
      }
    } catch (e) {
      console.error('Start listening error:', e);
      this.error = e.message;
      if (callback) {
        callback({ status: 'error', error: e.message });
      }
    }
  }

  // Stop voice recognition
  async stopListening(callback) {
    try {
      // Uncomment when Voice is available
      // await Voice.stop();

      if (callback && this.results.length > 0) {
        callback({ status: 'completed', results: this.results });
      }
    } catch (e) {
      console.error('Stop listening error:', e);
      if (callback) {
        callback({ status: 'error', error: e.message });
      }
    }
  }

  // Cancel voice recognition
  async cancelListening() {
    try {
      // Uncomment when Voice is available
      // await Voice.cancel();
      this.isListening = false;
    } catch (e) {
      console.error('Cancel listening error:', e);
    }
  }

  // Destroy voice instance
  async destroy() {
    try {
      // Uncomment when Voice is available
      // await Voice.destroy();
      // Voice.removeAllListeners();
    } catch (e) {
      console.error('Destroy error:', e);
    }
  }

  // Check if voice recognition is available
  async isAvailable() {
    try {
      // Uncomment when Voice is available
      // return await Voice.isAvailable();
      return true; // Mock
    } catch (e) {
      return false;
    }
  }

  // Get supported languages
  async getSupportedLanguages() {
    try {
      // Uncomment when Voice is available
      // return await Voice.getSupportedLanguages();
      return ['en-US', 'en-GB', 'es-ES', 'fr-FR']; // Mock
    } catch (e) {
      return [];
    }
  }
}

export default new VoiceSearchService();
