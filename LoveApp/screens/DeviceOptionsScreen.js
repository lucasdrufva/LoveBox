import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

import {baseUrl, useAuth} from '../AuthProvider';
import {useDevice} from '../DeviceContext';

export default function DeviceOptionsScreen() {
  const device = useDevice().device;
  const updateDevice = useDevice().setDevice;

  const [deviceName, setDeviceName] = useState(device.name);

  const auth = useAuth().auth;
  const navigation = useNavigation();

  function update() {
    axios
      .put(
        baseUrl + '/user/device/' + device.code + '/name/' + deviceName,
        {},
        {
          auth: auth,
        },
      )
      .then(response => {
        console.log(response.data);
        updateDevice({...device, name: deviceName});
        navigation.pop();
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <View style={styles.container}>
      <View style={{...styles.card, marginBottom: 'auto'}}>
        <Text style={styles.optionTitle}>Device name?</Text>
        <TextInput
          value={deviceName}
          style={styles.textInput}
          onChangeText={setDeviceName}
        />
      </View>
      <TouchableOpacity style={styles.send} onPress={update}>
        <Text>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'pink',
    flex: 1,
  },
  card: {
    borderRadius: 7,
    backgroundColor: '#e8fcf6',
    padding: 10,
    margin: 10,
    elevation: 10,
  },
  textInput: {
    borderColor: 'gray',
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    paddingLeft: 10,
    marginTop: 5,
  },
  optionTitle: {
    fontSize: 18,
    letterSpacing: 1.2,
    marginHorizontal: 5,
  },
  send: {
    elevation: 10,
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    borderRadius: 25,
    height: 50,
    backgroundColor: '#dda0dd',
    width: '50%',
  },
});
