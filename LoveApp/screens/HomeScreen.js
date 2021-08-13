import React from 'react';
import {useState} from 'react';
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
  const [currentText, setCurrentText] = useState('Hej');
  const [inputText, onChangeInputText] = useState('');

  const [devices, setDevices] = useState([]);

  const auth = useAuth().auth;

  function testButton() {
    console.log(devices);
  }

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

  function getStatus() {
    axios
      .get('http://10.0.2.2:5000/update')
      .then(response => {
        console.log(response);
        setCurrentText(String(response.data.text));
      })
      .catch(error => {
        console.log(error);
      });
  }

  function submitText() {
    axios.get('http://10.0.2.2:5000/text/' + inputText).then(() => {
      onChangeInputText('');
    });
  }

  async function pickImage() {
    try {
      console.log('pick image');
      ImagePicker.launchImageLibrary(
        {
          quality: 1,
          mediaType: 'photo',
        },
        response => {
          console.log('Response = ', response);

          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          } else {
            console.log('else');

            const data = new FormData();
            data.append('file', {
              name: response.assets[0].fileName,
              type: response.assets[0].type,
              uri: response.assets[0].uri,
            });

            axios
              .post('http://192.168.198.190:8080', data, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              })
              .then(response => {
                console.log(response.data);
              });
          }
        },
      ).catch(error => {
        console.log(error);
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <SafeAreaView>
      <Button title="Get devices" onPress={getDevices} />
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
      <AddDeviceButton />
      <Text />
      <Text>{currentText}</Text>
      <Button title="Get status" onPress={getStatus} />
      <TextInput value={inputText} onChangeText={onChangeInputText} />
      <Button title="Submit new text" onPress={submitText} />
      <Text />
      <Button title="Pick image" onPress={pickImage} />
      <Button title="Test" onPress={testButton} />
    </SafeAreaView>
  );
};

export default HomeScreen;
