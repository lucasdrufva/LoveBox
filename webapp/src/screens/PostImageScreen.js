import React from 'react';
import {useState} from 'react';
import {View, Text, TextInput, Button, Image} from 'react-native';
//import {Picker} from '@react-native-picker/picker';
//import * as ImagePicker from 'react-native-image-picker';

import {usePostImageStatus} from '../lib/api';

export default function PostImageScreen({navigation, route}) {
  const post = usePostImageStatus(route.params.device);
  const [notifier, setNotifier] = useState(0);
  const [image, setImage] = useState('');

  async function pickImage() {
    try {
      console.log('pick image');
      // ImagePicker.launchImageLibrary(
      //   {
      //     quality: 1,
      //     mediaType: 'photo',
      //   },
      //   response => {
      //     console.log('Response = ', response);

      //     if (response.didCancel) {
      //       console.log('User cancelled image picker');
      //     } else if (response.error) {
      //       console.log('ImagePicker Error: ', response.error);
      //     } else if (response.customButton) {
      //       console.log('User tapped custom button: ', response.customButton);
      //     } else {
      //       console.log('else');

      //       setImage(response.assets[0]);
      //     }
      //   },
      // ).catch(error => {
      //   console.log(error);
      // });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View>
      <Text>Notifier</Text>
      {/* <Picker
        mode="dropdown"
        selectedValue={notifier}
        style={{height: 50, width: 150}}
        onValueChange={(itemValue, itemIndex) => setNotifier(itemValue)}>
        <Picker.Item label="Rainbow" value={0} />
        <Picker.Item label="Flash" value={1} />
      </Picker> */}
      <Button title="Pick image" onPress={pickImage} />

      <Text />
      {image != null ? (
        <Image source={{uri: image.uri}} width={200} height={200} />
      ) : null}
      <Button
        title="Post image status"
        onPress={() => {
          post(image, notifier).then(() => {
            setImage(null);
            navigation.goBack();
          });
        }}
      />
    </View>
  );
}
