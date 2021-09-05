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

export default function RegisterScreen({navigation}) {
  const auth = useAuth();

  const [emailText, setEmailText] = useState('');
  const [passwordText, setPasswordText] = useState('');

  return (
    <SafeAreaView style={styles.container}>
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

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.forgot_button}>Already have an account?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerBtn}
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
          })
        }>
        <Text style={styles.loginText}>REGISTER</Text>
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

  registerBtn: {
    width: '80%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    backgroundColor: '#FF1493',
  },
});
