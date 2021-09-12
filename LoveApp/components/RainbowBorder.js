import React from 'react';
import {StyleSheet} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

export default function RainbowBorder({children}) {
  return (
    <LinearGradient
      colors={['#b827fc80', '#2c90fc80', '#b8fd3380', '#fec83780', '#fd189280']}
      start={{x: 0.0, y: 1.0}}
      end={{x: 1.0, y: 1.0}}
      style={styles.border}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  border: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    borderRadius: 10,
  },
});
