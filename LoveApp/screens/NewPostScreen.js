import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Button,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

import {ExpandableColorPicker} from '../components/ColorPicker';
import NotifierPicker from '../components/NotifierPicker';

import {usePostTextStatus, usePostImageStatus} from '../lib/api';
import {RGB888toRGB565} from '../lib/colorTools';

export const statusTypes = {
  IMAGE: 'image',
  TEXT: 'text',
};

export default function NewPostScreen({navigation, route}) {
  const [statusText, setStatusText] = useState('message');
  const [textColor, setTextColor] = useState([255, 255, 255]);
  const [backgroundColor, setBackgroundColor] = useState([0, 0, 0]);
  const [notifier, setNotifier] = useState(0);
  const [image, setImage] = useState('');

  const postText = usePostTextStatus(route.params.device);
  const postImage = usePostImageStatus(route.params.device);
  const type = route.params.type;

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
      );
    } catch (error) {
      console.log(error);
    }
  }

  function post() {
    if (type === statusTypes.TEXT) {
      postText({
        text: statusText,
        notifier: notifier,
        color: RGB888toRGB565(textColor[0], textColor[1], textColor[2]),
        backgroundColor: RGB888toRGB565(
          backgroundColor[0],
          backgroundColor[1],
          backgroundColor[2],
        ),
      }).then(() => {
        navigation.goBack();
      });
    } else {
      postImage(image, notifier).then(() => {
        navigation.goBack();
      });
    }
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{flexGrow: 1}}>
        {type === statusTypes.TEXT ? (
          <>
            <View style={styles.card}>
              <Text style={styles.optionTitle}>Text to display</Text>
              <TextInput
                value={statusText}
                onChangeText={setStatusText}
                style={styles.textInput}
              />
            </View>
            <View style={styles.card}>
              <Text style={styles.optionTitle}>Text Color</Text>
              <ExpandableColorPicker
                onChangeColor={setTextColor}
                startHSL={{hue: 0, sat: 0, val: 1}}
              />
            </View>
          </>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.optionTitle}>Image</Text>
              <View style={styles.imagePickContainer}>
                <View
                  style={{
                    backgroundColor: '#AAA',
                    width: 320,
                    height: 240,
                    marginTop: 10,
                  }}>
                  <Image source={{uri: image.uri}} width={320} height={240} />
                </View>
                <TouchableOpacity style={styles.pickImage} onPress={pickImage}>
                  <Text>Pick image</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        <View style={styles.card}>
          <Text style={styles.optionTitle}>Background Color</Text>
          <ExpandableColorPicker
            onChangeColor={setBackgroundColor}
            startHSL={{hue: 0, sat: 0, val: 0}}
          />
        </View>
        <View style={styles.card}>
          <Text style={styles.optionTitle}>Notifier</Text>
          <NotifierPicker onChange={setNotifier} />
        </View>
        <View style={{height: 100}} />
      </ScrollView>
      <TouchableOpacity style={styles.send} onPress={post}>
        <Text>Send</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'pink',
  },
  card: {
    borderRadius: 7,
    backgroundColor: '#e8fcf6',
    padding: 10,
    margin: 10,
    elevation: 10,
  },
  colorView: {
    flex: 3,
    borderRadius: 7,
    backgroundColor: '#e8fcf6',
    padding: 10,
    paddingBottom: 25,
    margin: 10,
    elevation: 10,
  },
  send: {
    elevation: 10,
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    borderRadius: 25,
    height: 50,
    backgroundColor: '#dda0dd',
    width: '50%',
  },
  textInput: {
    borderColor: 'gray',
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    paddingLeft: 10,
    marginTop: 5,
  },
  pickImage: {
    elevation: 5,
    backgroundColor: '#ABC',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  imagePickContainer: {
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 18,
    letterSpacing: 1.2,
    marginHorizontal: 5,
  },
});
