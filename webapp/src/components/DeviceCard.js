import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDevice} from '../DeviceContext';

export default function DeviceCard({device}) {
  const navigation = useNavigation();
  const setCurrentDevice = useDevice().setDevice;
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setCurrentDevice(device);
        navigation.navigate('Device');
      }}>
      <Image source={require('../assets/logo.png')} style={styles.img} />
      <Text style={styles.title}>{device.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 5,
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#e8fcf6',
    padding: 10,
    marginBottom: 10,
  },
  img: {
    resizeMode: 'contain',
    flex: 1,
    marginRight: 30,
  },
  title: {
    flex: 5,
    fontSize: 18,
  },
});
