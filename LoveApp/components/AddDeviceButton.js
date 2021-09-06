import React from 'react';
import {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Dialog from 'react-native-dialog';
import axios from 'axios';

import {AuthProvider, baseUrl, useAuth} from '../AuthProvider';

export default function AddDeviceButton({updateDevices}) {
  const [addDeviceVisible, setAddDeviceVisible] = useState(false);
  const [retryVisible, setRetryVisible] = useState(false);
  const [inputText, onChangeInputText] = useState('');

  const auth = useAuth().auth;

  const showAddDeviceDialog = () => {
    setAddDeviceVisible(true);
  };

  const handleAddDeviceCancel = () => {
    setAddDeviceVisible(false);
  };

  const handleRetryCancel = () => {
    setRetryVisible(false);
  };

  const handleAddDeviceSubmit = () => {
    setAddDeviceVisible(false);
    // Submit
    // on error show error dialog and ask to try again
    axios
      .post(baseUrl + '/user/device/' + inputText, null, {
        auth: auth,
      })
      .then(response => {
        console.log(response);
        //Triggers rerender of device list
        updateDevices();
      })
      .catch(error => {
        console.log(error);
        setRetryVisible(true);
      });
  };

  const handleRetry = () => {
    setRetryVisible(false);
    setAddDeviceVisible(true);
  };

  return (
    <View>
      <TouchableOpacity
        title="Add Device"
        onPress={showAddDeviceDialog}
        style={styles.addDeviceBtn}>
        <Text>Add Device</Text>
      </TouchableOpacity>
      <Dialog.Container visible={addDeviceVisible}>
        <Dialog.Title> Add Device </Dialog.Title>
        <Dialog.Description> Enter code shown on screen: </Dialog.Description>
        <Dialog.Input value={inputText} onChangeText={onChangeInputText} />
        <Dialog.Button label="Cancel" onPress={handleAddDeviceCancel} />
        <Dialog.Button label="Add" onPress={handleAddDeviceSubmit} />
      </Dialog.Container>
      <Dialog.Container visible={retryVisible}>
        <Dialog.Title> Action Failed </Dialog.Title>
        <Dialog.Description> Do you want to retry? </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={handleRetryCancel} />
        <Dialog.Button label="Retry" onPress={handleRetry} />
      </Dialog.Container>
    </View>
  );
}

const styles = StyleSheet.create({
  addDeviceBtn: {
    marginTop: 30,
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFC0CB',
  },
});
