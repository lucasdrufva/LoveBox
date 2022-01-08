import React from 'react';
import {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
//import {Picker} from '@react-native-picker/picker';
import {StackActions} from '@react-navigation/stack';

import ColorPicker from '../components/OldColorPicker';
import {usePostTextStatus} from '../lib/api';

export default function PostTextScreen({navigation, route}) {
  const post = usePostTextStatus(route.params.device);
  const [inputText, onChangeInputText] = useState('');
  const [notifier, setNotifier] = useState(0);
  const [color, setColor] = useState(65500);
  const [backgroundColor, setBackgroundColor] = useState(0);
  return (
    <View>
      <Text>Enter text:</Text>
      <TextInput value={inputText} onChangeText={onChangeInputText} />
      <Text>Notifier</Text>
      {/* <Picker
        mode="dropdown"
        selectedValue={notifier}
        style={{height: 50, width: 150}}
        onValueChange={(itemValue, itemIndex) => setNotifier(itemValue)}>
        <Picker.Item label="Rainbow" value={0} />
        <Picker.Item label="Flash" value={1} />
      </Picker> */}
      <Text>Color:</Text>
      <ColorPicker color={color} setColor={setColor} />
      <Text>Background color:</Text>
      <ColorPicker color={backgroundColor} setColor={setBackgroundColor} />
      <Button
        title="Post text status"
        onPress={() => {
          post({text: inputText, notifier, color, backgroundColor});
          navigation.goBack();
        }}
      />
    </View>
  );
}
