import React from 'react';
import {useRef, useCallback} from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
//import {BottomSheetModal, BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
//import Icon from 'react-native-vector-icons/FontAwesome';
import {statusTypes} from '../screens/NewPostScreen';
import '../styles/device.css'

export default function AddStatusButton() {
  const navigation = useNavigation();
  const bottomSheetModalRef = useRef(null);

  return <button className='add_button' onClick={() => {
    navigation.navigate('PostStatus', {
      type: statusTypes.TEXT,
    });
  }}>+</button>
}

const styles = StyleSheet.create({
  add: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: '#49f2ba',
    padding: 10,
    alignItems: 'center',
    elevation: 8,
  },
  modal: {
    backgroundColor: '#EFEFEF',
  },
  button: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 5,
    padding: 10,
    alignItems: 'center',
    elevation: 3,
  },
});
