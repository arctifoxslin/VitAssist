/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import * as React from 'react';
import { Text, View } from 'react-native';
import { AppProviders } from './src/app/providers/AppProviders';
import AppNavigationMap from './src/app/navigation/AppNavigationMap';

export default function App() {
  return (
    <AppProviders>
      <AppNavigationMap />
    </AppProviders>
  )
}