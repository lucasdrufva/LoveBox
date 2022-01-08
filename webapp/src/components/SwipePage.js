import React from 'react';
import {View, Text} from 'react-native';

export default function SwipePage({backgroundColor}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor,
      }}>
      <Text>Hejjsan</Text>
    </View>
  );
}
