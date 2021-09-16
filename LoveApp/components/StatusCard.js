import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

import {Card} from 'react-native-shadow-cards';

import RainbowBorder from './RainbowBorder';
import FlashBorder from './FlashBorder';

export default function StatusCard({status}) {
  function content() {
    return (
      <Card style={styles.card}>
        {status.type == 1 ? (
          <>
            <Text>{status.preview}</Text>
            <Text>Seen: {status.seen.toString()}</Text>
          </>
        ) : (
          <>
            <Image
              source={{
                uri: 'http://192.168.198.190:4566/test/' + status.preview,
              }}
              style={{height: 200, resizeMode: 'contain', margin: 5}}
            />
            <Text>Seen: {status.seen.toString()}</Text>
          </>
        )}
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
