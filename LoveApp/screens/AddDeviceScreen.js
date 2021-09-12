import React, {useRef, useState} from 'react';
import {View, Text, TextInput} from 'react-native';
import PagerView from 'react-native-pager-view';
import axios from 'axios';

import SwipeFooter from '../components/SwipeFooter';
import SwipePage from '../components/SwipePage';
import {baseUrl, useAuth} from '../AuthProvider';

export default function AddDeviceScreen({navigation}) {
  const [code, setCode] = useState('');

  const pagerRef = useRef(null);
  const inputRef = useRef(null);

  const auth = useAuth().auth;

  function changePage(pageNummer) {
    pagerRef.current.setPage(pageNummer);
  }

  function triggerKeyboard() {
    setTimeout(() => inputRef.current.focus(), 500);
  }

  const handleAddDeviceSubmit = () => {
    axios
      .post(baseUrl + '/user/device/' + code, null, {
        auth: auth,
      })
      .then(response => {
        console.log(response);
        //TODO: Trigger rerender of device list
        navigation.pop();
      })
      .catch(error => {
        //TODO: handle error
        console.log(error);
      });
  };

  return (
    <PagerView style={{flex: 1}} initialPage={0} ref={pagerRef}>
      <View key="1">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#dda0dd',
          }}>
          <Text>
            Håll inne knappen under enheten tills en kod visas på skärmen
          </Text>
          <Text />
          <Text />
          <Text />
          <Text />
          <Text />
          <Text />
          <Text />
          <Text>(Cool animation)</Text>
          <Text />
          <Text />
          <Text />
          <Text />
          <Text />
          <Text />
          <Text />
          <Text />
          <Text />
          <Text />
          <Text />
          <Text />
        </View>
        <SwipeFooter
          backgroundColor="#dda0dda0"
          rightButtonLabel="Next"
          rightButtonPress={() => {
            changePage(1);
            triggerKeyboard();
          }}
        />
      </View>
      <View key="2">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#e6bcb3',
          }}>
          <TextInput
            ref={inputRef}
            value={code}
            keyboardType="numeric"
            placeholder="Code"
            placeholderTextColor="#003f5c"
            onChangeText={code => setCode(code)}
          />
        </View>
        <SwipeFooter
          backgroundColor="#e6bcb3c0"
          rightButtonLabel="Add Device"
          leftButtonLabel="Back"
          leftButtonPress={() => changePage(0)}
          rightButtonPress={handleAddDeviceSubmit}
        />
      </View>
    </PagerView>
  );
}
