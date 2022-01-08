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
  TouchableOpacity,
} from 'react-native';

import axios from 'axios';

import {baseUrl, useAuth} from '../AuthProvider';
import AddDeviceButton from '../components/AddDeviceButton';
import DeviceCard from '../components/DeviceCard';
import {useDevice} from '../DeviceContext';

const HomeScreen: () => Node = ({navigation}) => {
  const [devices, setDevices] = useState([]);

  const auth = useAuth().auth;

  useEffect(() => {
    getDevices();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDevices();
    });

    return unsubscribe;
  }, [navigation]);

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
              renderItem={device => <DeviceCard device={device.item} />}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <Text style={{marginBottom: 'auto', textAlign: 'center'}}>
              Add a device to get started
            </Text>
          )}

          <TouchableOpacity
            title="Add Device"
            onPress={() => {
              navigation.navigate('AddDevice', {refresh: getDevices});
            }}
            style={styles.addDeviceBtn}>
            <Text>Add Device</Text>
          </TouchableOpacity>
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
  addDeviceBtn: {
    marginTop: 30,
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFC0CB',
  },
});
