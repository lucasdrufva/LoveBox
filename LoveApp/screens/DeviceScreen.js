import React from 'react';
import {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'react-native-image-picker';

import {useAuth} from '../AuthProvider';

export default function DeviceScreen({route}) {
  const name = route.params.name || 'No Name device';
  const [inputText, onChangeInputText] = useState('');
  const [image, setImage] = useState('');

  const auth = useAuth().auth;

  function postTextStatus() {
    axios
      .post(
        'http://10.0.2.2:5000/user/device/' + name + '/status/text',
        {notifier: 0, text: inputText},
        {
          auth: auth,
        },
      )
      .then(response => {
        console.log(response.data);
        onChangeInputText('');
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

    axios
      .post(
        'http://10.0.2.2:5000/user/device/' + name + '/status/image',
        data,
        {
          auth: auth,
        },
      )
      .then(response => {
        console.log(response.data);
        setImage(null);
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <View>
      <Text>{name}</Text>
      <TextInput value={inputText} onChangeText={onChangeInputText} />
      <Button title="post new text status" onPress={postTextStatus} />
      <Text />
      <Button title="pick image" onPress={pickImage} />
      <Button title="post image status" onPress={postImageStatus} />
    </View>
  );
}
