import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
//import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';

import AddStatusButton from '../components/AddStatusButton';

export default function BottomBar() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          navigation.navigate('Home');
        }}>
        {/* <Icon name="bars" size={30} color="#555" /> */}
        <Text>Devices</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          navigation.navigate('DeviceOptions');
        }}>
        {/* <Icon name="cog" size={30} color="#555" /> */}
        <Text>Options</Text>
      </TouchableOpacity>
      <AddStatusButton />
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          navigation.navigate('Inbox');
        }}>
        {/* <Icon name="envelope" size={30} color="#555" /> */}
        <Text>Inbox</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
        {/* <Icon name="user" size={30} color="#555" /> */}
        <Text>Me</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'rgba(245,190,190,255)',
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
});
