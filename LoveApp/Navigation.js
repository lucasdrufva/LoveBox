import React from 'react';
import {View, Text} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DeviceScreen from './screens/DeviceScreen';
import PostTextScreen from './screens/PostTextScreen';
import PostImageScreen from './screens/PostImageScreen';
import {useAuth} from './AuthProvider';

const Stack = createStackNavigator();

const AuthNavigator = createStackNavigator();

function Auth() {
  return (
    <AuthNavigator.Navigator>
      <AuthNavigator.Screen
        name="Register"
        component={RegisterScreen}
        options={{headerShown: false}}
      />
      <AuthNavigator.Screen name="Login" component={LoginScreen} />
    </AuthNavigator.Navigator>
  );
}

export default function Navigation() {
  const auth = useAuth().auth;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {auth == null ? (
          <Stack.Screen
            name="Auth"
            component={Auth}
            options={{headerShown: false}}
          />
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{title: 'LoveLocker'}}
            />
            <Stack.Screen name="Device" component={DeviceScreen} />
            <Stack.Screen name="PostText" component={PostTextScreen} />
            <Stack.Screen name="PostImage" component={PostImageScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
