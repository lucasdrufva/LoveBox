import React from 'react';
import {useRef, useCallback} from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import {BottomSheetModal, BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {statusTypes} from '../screens/NewPostScreen';

export default function AddStatusButton({code}) {
  const navigation = useNavigation();
  const bottomSheetModalRef = useRef(null);

  const handleOpenModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    props => <BottomSheetBackdrop {...props} opacity={0.1} />,
    [],
  );

  return (
    <>
      <TouchableOpacity style={styles.add} onPressIn={handleOpenModal}>
        <Icon name="plus" size={30} color="#555" />
      </TouchableOpacity>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.modal}
        snapPoints={['20%']}>
        <View style={styles.modal}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate('PostStatus', {
                device: code,
                type: statusTypes.TEXT,
              });
            }}>
            <Text>New Text Status</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate('PostStatus', {
                device: code,
                type: statusTypes.IMAGE,
              });
            }}>
            <Text>New Image Status</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    </>
  );
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
