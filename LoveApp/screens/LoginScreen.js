import React from 'react';
import {useState} from 'react';
import {
  SafeAreaView,
  Text,
  Button,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {baseUrl, useAuth} from '../AuthProvider';

export default function LoginScreen({navigation}) {
  const auth = useAuth();

  const [emailText, setEmailText] = useState('');
  const [passwordText, setPasswordText] = useState('');

  const [errorText, setErrorText] = useState('');

  function register() {
    let user = {
      client: {clientName: emailText, password: passwordText, type: 'USER'},
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
    <SafeAreaView style={styles.container}>
      {/* <Text>Username</Text>
      <TextInput value={usernameText} onChangeText={onChangeUsernameText} />
      <Text>Password</Text>
      <TextInput value={passwordText} onChangeText={onChangePasswordText} />
      <Button title="register" onPress={register} />
      <Text />
      <Button title="login" onPress={checkLogin} />
      <ScrollView>
        <Text>{errorText}</Text>
      </ScrollView> */}
      <Image source={require('../assets/logo.png')} style={styles.image} />
      <View style={styles.inputView}>
        <TextInput
          value={emailText}
          style={styles.TextInput}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={email => setEmailText(email)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          value={passwordText}
          style={styles.TextInput}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={password => setPasswordText(password)}
        />
      </View>

      <TouchableOpacity>
        <Text style={styles.forgot_button}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginBtn}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 50,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    resizeMode: 'contain',
    borderRadius: 5,
    marginBottom: 40,
    flex: 0.5,
  },
  inputView: {
    backgroundColor: '#FFC0CB',
    borderRadius: 30,
    width: '70%',
    height: 45,
    marginBottom: 20,
    alignItems: 'center',
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },

  forgot_button: {
    height: 30,
    marginBottom: 0,
  },

  loginBtn: {
    width: '80%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    backgroundColor: '#FF1493',
  },
});
