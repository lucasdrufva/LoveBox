import React from 'react';
import {useState} from 'react';
import {SafeAreaView, Text, Button, TextInput, ScrollView} from 'react-native';
import axios from 'axios';
import {baseUrl, useAuth} from '../AuthProvider';

export default function LoginScreen({navigation}) {
  const auth = useAuth();

  const [usernameText, onChangeUsernameText] = useState('');
  const [passwordText, onChangePasswordText] = useState('');

  const [errorText, setErrorText] = useState('');

  function register() {
    let user = {
      client: {clientName: usernameText, password: passwordText, type: 'USER'},
    };
    axios
      .post(baseUrl + '/user/register', user, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        console.log(response.data);
      });
  }

  function checkLogin() {
    axios
      .get(baseUrl + '/user', {
        auth: {
          username: usernameText,
          password: passwordText,
        },
      })
      .then(response => {
        console.log(response.data);
        if (response.data === usernameText) {
          //success
          auth.setAuth({username: usernameText, password: passwordText});
          navigation.navigate('Home');
        }
      })
      .catch(error => {
        console.log(error);
        setErrorText(JSON.stringify(error));
      });
  }

  return (
    <SafeAreaView>
      <Text>Username</Text>
      <TextInput value={usernameText} onChangeText={onChangeUsernameText} />
      <Text>Password</Text>
      <TextInput value={passwordText} onChangeText={onChangePasswordText} />
      <Button title="register" onPress={register} />
      <Text />
      <Button title="login" onPress={checkLogin} />
      <ScrollView>
        <Text>{errorText}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
