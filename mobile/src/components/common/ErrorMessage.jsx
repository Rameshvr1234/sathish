import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from './Button';

const ErrorMessage = ({message, onRetry}) => {
  return (
    <View style={styles.container}>
      <Icon name="alert-circle-outline" size={64} color="#ff4d4f" />
      <Text style={styles.message}>{message || 'Something went wrong'}</Text>
      {onRetry && (
        <Button title="Try Again" onPress={onRetry} style={styles.button} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  message: {
    fontSize: 16,
    color: '#595959',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  button: {
    minWidth: 120,
  },
});

export default ErrorMessage;
