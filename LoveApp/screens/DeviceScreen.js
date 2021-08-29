import React from 'react';
import {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, FlatList} from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'react-native-image-picker';
import {Picker} from '@react-native-picker/picker';

import {baseUrl, useAuth} from '../AuthProvider';
import StatusCard from '../components/StatusCard';

export default function DeviceScreen({navigation, route}) {
  const name = route.params.name || 'No Name device';
  const [inputText, onChangeInputText] = useState('');
  const [image, setImage] = useState('');
  const [statuses, setStatuses] = useState([]);

  const auth = useAuth().auth;

  useEffect(() => {
    getStatuses();
  }, []);

  useEffect(() => {
    navigation.addListener('focus', () => {
      getStatuses();
    });
  }, [navigation]);

  function getStatuses() {
    axios
      .get(baseUrl + '/user/device/' + name + '/status', {
        auth: auth,
      })
      .then(response => {
        console.log(response.data);
        setStatuses(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  function postTextStatus(textStatus) {
    axios
      .post(baseUrl + '/user/device/' + name + '/status/text', textStatus, {
        auth: auth,
      })
      .then(response => {
        console.log(response.data);
        onChangeInputText('');
        getStatuses();
      })
      .catch(error => {
        console.log(error);
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

            setImage(response.assets[0]);
          }
        },
      ).catch(error => {
        console.log(error);
      });
    } catch (error) {
      console.log(error);
    }
  }

  function postImageStatus() {
    if (image == null) {
      console.log('null image');
      return;
    }

    const data = new FormData();
    data.append('file', {
      name: image.fileName,
      type: image.type,
      uri: image.uri,
    });
    data.set('notifier', 0);

    axios
      .post(baseUrl + '/user/device/' + name + '/status/image', data, {
        auth: auth,
      })
      .then(response => {
        console.log(response.data);
        setImage(null);
        getStatuses();
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <View>
      <Text>{name}</Text>
      <Button
        title="Post text status"
        onPress={() => {
          navigation.navigate('PostText', {device: name});
        }}
      />
      <Text />
      <Button
        title="Post image status"
        onPress={() => {
          navigation.navigate('PostImage', {device: name});
        }}
      />
      <FlatList
        data={statuses}
        renderItem={status => <StatusCard status={status.item} />}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
      />
    </View>
  );
}
