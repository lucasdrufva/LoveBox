import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {Card} from 'react-native-shadow-cards';

import RainbowBorder from './RainbowBorder';
import FlashBorder from './FlashBorder';

export default function StatusCard({status}) {
  function content() {
    return (
      <Card style={styles.card}>
        <Text>{status.preview}</Text>
        <Text>Seen: {status.seen.toString()}</Text>
      </Card>
    );
  }

  return (
    <View>
      {status.notifier == 0 ? (
        <RainbowBorder>{content()}</RainbowBorder>
      ) : (
        <FlashBorder>{content()}</FlashBorder>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 5,
    margin: 5,
    shadowColor: '#fff',
  },
});
