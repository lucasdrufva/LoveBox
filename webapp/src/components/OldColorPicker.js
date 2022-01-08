import React from 'react';
import {View, Text} from 'react-native';
//import {Picker} from '@react-native-picker/picker';

export default function ColorPicker({color, setColor}) {
  return (
    <View>
      {/* <Picker
        mode="dropdown"
        selectedValue={color}
        style={{height: 50, width: 150}}
        onValueChange={(itemValue, itemIndex) => setColor(itemValue)}>
        <Picker.Item label="White" value={65500} />
        <Picker.Item label="Yellow" value={60000} />
        <Picker.Item label="Pink" value={50000} />
        <Picker.Item label="Green" value={1000} />
        <Picker.Item label="Blue" value={500} />
        <Picker.Item label="Black" value={0} />
      </Picker> */}
    </View>
  );
}
