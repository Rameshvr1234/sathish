import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import VoiceSearchService from '../services/VoiceSearchService';

/**
 * Voice Search Button Component
 *
 * Provides a floating button for voice search functionality
 *
 * Usage:
 * <VoiceSearchButton onResults={(text) => handleSearch(text)} />
 */

const VoiceSearchButton = ({ onResults, style }) => {
  const [isListening, setIsListening] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const pulseAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    if (isListening) {
      startPulseAnimation();
    } else {
      stopPulseAnimation();
    }
  }, [isListening]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        })
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.setValue(1);
  };

  const handlePress = async () => {
    setShowModal(true);
    setError('');
    setTranscript('');

    try {
      const available = await VoiceSearchService.isAvailable();
      if (!available) {
        setError('Voice recognition is not available on this device');
        return;
      }

      await VoiceSearchService.startListening((result) => {
        if (result.status === 'started') {
          setIsListening(true);
        } else if (result.status === 'completed') {
          setIsListening(false);
          if (result.results && result.results.length > 0) {
            const text = result.results[0];
            setTranscript(text);
            if (onResults) {
              onResults(text);
            }
            // Close modal after a delay
            setTimeout(() => {
              setShowModal(false);
            }, 1000);
          }
        } else if (result.status === 'error') {
          setIsListening(false);
          setError(result.error || 'An error occurred');
        }
      });
    } catch (err) {
      setError(err.message || 'Failed to start voice recognition');
      setIsListening(false);
    }
  };

  const handleStop = async () => {
    setIsListening(false);
    await VoiceSearchService.stopListening((result) => {
      if (result.results && result.results.length > 0) {
        const text = result.results[0];
        setTranscript(text);
        if (onResults) {
          onResults(text);
        }
      }
    });
  };

  const handleCancel = async () => {
    await VoiceSearchService.cancelListening();
    setIsListening(false);
    setShowModal(false);
    setTranscript('');
    setError('');
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.voiceButton, style]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Icon name="mic" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {error ? (
              <>
                <Icon name="close-circle" size={80} color="#ef4444" />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            ) : transcript ? (
              <>
                <Icon name="checkmark-circle" size={80} color="#10b981" />
                <Text style={styles.transcriptTitle}>You said:</Text>
                <Text style={styles.transcriptText}>{transcript}</Text>
                <ActivityIndicator size="small" color="#3b82f6" style={styles.loader} />
                <Text style={styles.searchingText}>Searching...</Text>
              </>
            ) : (
              <>
                <Animated.View style={[styles.micContainer, { transform: [{ scale: pulseAnim }] }]}>
                  <Icon
                    name="mic"
                    size={80}
                    color={isListening ? '#ef4444' : '#3b82f6'}
                  />
                </Animated.View>

                <Text style={styles.listeningText}>
                  {isListening ? 'Listening...' : 'Tap to speak'}
                </Text>

                <Text style={styles.hintText}>
                  {isListening
                    ? 'Say something like "3 BHK apartment in Bangalore"'
                    : 'Voice search is ready'}
                </Text>

                {isListening ? (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
                      <Icon name="stop" size={24} color="#fff" />
                      <Text style={styles.buttonText}>Stop</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                      <Icon name="close" size={24} color="#fff" />
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.startButton} onPress={handlePress}>
                    <Icon name="mic" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Start Listening</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  voiceButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400
  },
  micContainer: {
    marginBottom: 20
  },
  listeningText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10
  },
  hintText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30
  },
  transcriptTitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 20,
    marginBottom: 10
  },
  transcriptText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 20
  },
  searchingText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 10
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6b7280',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8
  },
  closeButton: {
    backgroundColor: '#6b7280',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  loader: {
    marginTop: 10
  }
});

export default VoiceSearchButton;
