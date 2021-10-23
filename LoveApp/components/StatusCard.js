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
                //TODO replace string with constant from auth
                uri:
                  'http://s3.eu-north-1.amazonaws.com/lucasdrufva-lovebox/' +
                  status.preview,
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
