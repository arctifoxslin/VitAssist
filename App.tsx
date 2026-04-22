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
import { notificationAPI } from './src/shared/notifications/notificationAPI';
import { NotificationData } from './src/features/notifications/types';
import { navigationRef } from './src/app/navigation/NavigationRef'; import { store } from './src/app/store/store';
import { intakeService } from './src/shared/intake/IntakeService';
import { getPastIntakes } from './src/shared/utils/generatePlannedIntakes';
import { notificationService } from './src/shared/notifications/NotificationService';

export default function App() {
  useEffect(() => {
    const init = async () => {
      /*await notificationService.cancelAll()*/
      await notificationAPI.reqestPermissions()
      await notificationAPI.createChannel()

      const schedules = store.getState().schedules.list

      for (const schedule of schedules) {
        const planneedTimed = getPastIntakes(schedule)
        await intakeService.checkMissed(schedule, planneedTimed)
        await notificationService.scheduleForSchedule(schedule)
      }

      notificationAPI.onPress((raw) => {
        const data = raw as NotificationData

        const plannedTime = Number(data.plannedTime)
        const repeatIndex = Number(data.repeatIndex)
        const isRepeatReminder = data.isRepeatReminder === 'true'
        const isSnoozed = data.isSnoozed === 'true'

        console.log("Notification pressed:", {
          ...data,
          plannedTime,
          repeatIndex,
          isRepeatReminder,
          isSnoozed,
        })

        if (data.type === 'intake_reminder' && data.scheduleId && plannedTime) {
          navigationRef.current?.navigate("IntakeNavigationMap", {
            screen: "IntakeScreen",
            params: {
              scheduleId: data.scheduleId,
              plannedTime: Number(plannedTime),
            }
          })
        }
      })
    }
    init()
  }, [])

  return (
    <AppProviders>
      <AppNavigationMap />
    </AppProviders>
  )
}