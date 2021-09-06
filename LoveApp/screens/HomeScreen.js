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
  ImageBackground,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import Dialog from 'react-native-dialog';

import axios from 'axios';
import * as ImagePicker from 'react-native-image-picker';
import {uploadFiles, DocumentDirectoryPath} from 'react-native-fs';
import {baseUrl, useAuth} from '../AuthProvider';
import AddDeviceButton from '../components/AddDeviceButton';
import DeviceCard from '../components/DeviceCard';

const HomeScreen: () => Node = ({navigation}) => {
  const [devices, setDevices] = useState([]);

  const auth = useAuth().auth;

  useEffect(() => {
    getDevices();
  }, []);

  function getDevices() {
    axios
      .get(baseUrl + '/user/device', {
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
      <ImageBackground
        source={require('../assets/LB_background1.png')}
        resizeMode="cover"
        style={{width: '100%', height: '100%'}}>
        <View style={styles.container}>
          {devices.length > 0 ? (
            <FlatList
              data={devices}
              renderItem={device => (
                // <Button
                //   title={device.item.name}
                //   onPress={() =>
                //     navigation.navigate('Device', {name: device.item.name})
                //   }
                // />
                <DeviceCard device={device.item} />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <Text style={{marginBottom: 'auto', textAlign: 'center'}}>
              Add a device to get started
            </Text>
          )}

          <AddDeviceButton updateDevices={getDevices} />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
    justifyContent: 'center',
  },
});
