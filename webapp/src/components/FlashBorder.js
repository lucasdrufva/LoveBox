import React from 'react';
import {StyleSheet, View} from 'react-native';

export default function FlashBorder({children}) {
  return <View style={styles.border}>{children}</View>;
}

const styles = StyleSheet.create({
  border: {
    backgroundColor: '#ffffffa0',
    borderRadius: 10,
    margin: 5,
    shadowColor: '#fff',
    shadowOffset: {width: -10, height: 4},
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 20,
  },
});
