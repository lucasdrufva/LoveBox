import React from 'react';
import {View, Text} from 'react-native';

import {Card} from 'react-native-shadow-cards';

export default function StatusCard({status}) {
  return (
    <View>
      <Card style={{padding: 5, margin: 5}}>
        <Text>{status.preview}</Text>
        <Text>Seen: {status.seen.toString()}</Text>
      </Card>
    </View>
  );
}
