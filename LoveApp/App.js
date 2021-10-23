/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  TextInput,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {AuthProvider} from './AuthProvider';
import Navigation from './Navigation';
import {DeviceProvider} from './DeviceContext';
import RemotePushController from './lib/RemotePushController';

const App: () => Node = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <AuthProvider auth={null}>
        <DeviceProvider device={null}>
          <Navigation />
        </DeviceProvider>
      </AuthProvider>
      <RemotePushController />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
