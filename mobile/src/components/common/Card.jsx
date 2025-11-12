import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

const Card = ({children, style, onPress, elevation = 2}) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.card, {elevation}, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}>
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default Card;
