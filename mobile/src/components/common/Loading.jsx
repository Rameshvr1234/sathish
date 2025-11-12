import React from 'react';
import {View, ActivityIndicator, Text, StyleSheet} from 'react-native';

const Loading = ({message = 'Loading...', size = 'large'}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color="#1890ff" />
      {message && <Text style={styles.text}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: '#8c8c8c',
  },
});

export default Loading;
