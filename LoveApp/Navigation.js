import React from 'react';
import {View, Text, Image} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import AddDeviceScreen from './screens/AddDeviceScreen';
import DeviceScreen from './screens/DeviceScreen';
import PostTextScreen from './screens/PostTextScreen';
import NewPostScreen from './screens/NewPostScreen';
import PostImageScreen from './screens/PostImageScreen';
import {useAuth} from './AuthProvider';

const Stack = createStackNavigator();

const AuthNavigator = createStackNavigator();

const headerColor = '#b0c4de';

function LogoTitle() {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Text style={{fontWeight: 'bold', fontSize: 20}}>Annika's Box</Text>
      <Image
        style={{width: 40, height: 40, marginLeft: 120}}
        source={require('./assets/logo.png')}
      />
    </View>
  );
}

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
              options={{
                title: 'LoveLocker',
                headerStyle: {
                  backgroundColor: headerColor,
                },
              }}
            />
            <Stack.Screen name="AddDevice" component={AddDeviceScreen} />
            <Stack.Screen
              name="Device"
              component={DeviceScreen}
              options={{
                headerTitle: props => <LogoTitle {...props} />,
                headerStyle: {
                  backgroundColor: headerColor,
                },
              }}
            />
            <Stack.Screen
              name="PostStatus"
              component={NewPostScreen}
              options={{
                headerStyle: {
                  backgroundColor: headerColor,
                },
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
