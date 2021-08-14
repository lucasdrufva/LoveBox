import React from 'react';
import {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  TextInput,
  FlatList,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import Dialog from 'react-native-dialog';

import axios from 'axios';
import * as ImagePicker from 'react-native-image-picker';
import {uploadFiles, DocumentDirectoryPath} from 'react-native-fs';
import {useAuth} from '../AuthProvider';
import AddDeviceButton from '../components/AddDeviceButton';

const HomeScreen: () => Node = ({navigation}) => {
  const [devices, setDevices] = useState([]);

  const auth = useAuth().auth;

  useEffect(() => {
    getDevices();
  }, []);

  function getDevices() {
    axios
      .get('http://10.0.2.2:5000/user/device', {
        auth: auth,
      })
      .then(response => {
        console.log(response.data);
        setDevices(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <SafeAreaView>
      <FlatList
        data={devices}
        renderItem={device => (
          <Button
            title={device.item.name}
            onPress={() =>
              navigation.navigate('Device', {name: device.item.name})
            }
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <AddDeviceButton updateDevices={getDevices} />
    </SafeAreaView>
  );
};

export default HomeScreen;
