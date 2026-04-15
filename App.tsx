/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import * as React from 'react';
import { useEffect } from 'react';
import { AppProviders } from './src/app/providers/AppProviders';
import AppNavigationMap from './src/app/navigation/AppNavigationMap';
import { notificationService } from './src/features/notifications/NotificationService';
import { navigationRef } from './src/app/navigation/NavigationRef';

export default function App() {
  useEffect(() => {
    notificationService.reqestPermissions()
    notificationService.createChannel()
    notificationService.onPressNotification((data) => {
      console.log("Notification pressed: ", data)
      navigationRef.current?.navigate("IntakeNavigationMap", {
        screen: "IntakeScreen",
        params: {
          scheduleId: data.scheduleId!,
          time: data.time!,
        }
      })
    })
  }, [])

  return (
    <AppProviders>
      <AppNavigationMap />
    </AppProviders>
  )
}