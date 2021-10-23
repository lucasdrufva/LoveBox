import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

import {baseUrl, useAuth} from '../AuthProvider';

export default function InboxScreen() {
  const [notifications, setNotitications] = useState([]);

  const auth = useAuth().auth;
  const navigation = useNavigation();

  useEffect(() => {
    getNotifications();
  }, []);

  function getNotifications() {
    axios
      .get(baseUrl + '/user/notification', {
        auth: auth,
      })
      .then(response => {
        console.log(response.data);
        setNotitications(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  useEffect(() => {
    testNotifications();
  }, []);

  function testNotifications() {
    axios
      .get(
        baseUrl +
          '/user/notification/test?token=' +
          (global.notificationToken != undefined
            ? global.notificationToken.token
            : ''),
        {
          auth: auth,
        },
      )
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log('hmm error here');
        console.log(global.notificationToken.token);
        console.log(
          baseUrl +
            '/user/notification/test?token=' +
            global.notificationToken !=
            undefined
            ? global.notificationToken.token
            : '',
        );
        console.log(error);
      });
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={notification => (
          <TouchableOpacity style={styles.card}>
            <Text>{notification.item.message}</Text>
            <Text>{notification.item.date.split('T').join(' ')}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'pink',
    flex: 1,
  },
  card: {
    borderRadius: 7,
    backgroundColor: '#e8fcf6',
    padding: 10,
    margin: 10,
    elevation: 10,
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
  optionTitle: {
    fontSize: 18,
    letterSpacing: 1.2,
    marginHorizontal: 5,
  },
});
