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
import logo from '../assets/logo.png'
import '../styles/login.css'

export default function LoginScreen({navigation}) {
  const auth = useAuth();

  const [emailText, setEmailText] = useState('');
  const [passwordText, setPasswordText] = useState('');

  function login() {
    axios
      .get(baseUrl + '/user', {
        auth: {
          username: emailText,
          password: passwordText,
        },
      })
      .then(response => {
        console.log(response.data);
        if (response.data === emailText) {
          //success
          auth.setAuth({username: emailText, password: passwordText});
          navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <div id="login_container">
      <img id="login_logo" src={logo} alt="Logo"></img>
      <h1 id="login_title">Login</h1>
      <div className="login_input_container">
        <TextInput
          value={emailText}
          style={styles.TextInput}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={email => setEmailText(email)}
        />
      </div>

      <div className="login_input_container">
        <TextInput
          value={passwordText}
          style={styles.TextInput}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={password => setPasswordText(password)}
        />
      </div>

      <TouchableOpacity>
        <Text style={styles.forgot_button}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginBtn} onPress={login}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
    </div>
  );
}

const styles = StyleSheet.create({
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
