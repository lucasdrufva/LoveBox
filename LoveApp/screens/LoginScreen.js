import React from 'react';
import {useState} from 'react';
import {SafeAreaView, Text, Button, TextInput} from 'react-native';
import axios from 'axios';
import {useAuth} from '../AuthProvider';

export default function LoginScreen({navigation}) {
  const auth = useAuth();

  const [usernameText, onChangeUsernameText] = useState('');
  const [passwordText, onChangePasswordText] = useState('');

  function register() {
    let user = {
      client: {clientName: usernameText, password: passwordText, type: 'USER'},
    };
    axios
      .post('http://10.0.2.2:5000/user/register', user, {
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
      .get('http://10.0.2.2:5000/user', {
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
    </SafeAreaView>
  );
}
