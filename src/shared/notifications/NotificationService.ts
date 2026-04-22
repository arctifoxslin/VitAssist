import { notificationAPI } from "./notificationAPI";
import { notificationRepository } from "./NotificationRepository";
import { Schedule } from "../types/Schedule";
import { generateNotificationId } from "../../features/notifications/id";
import { intakeService } from "../intake/IntakeService";
import { getNextIntake, getPastIntakes, getNextIntakeTimeAfter } from "../utils/generatePlannedIntakes";
class NotificationService {
    /*------Schedule Primary Notifications------*/
    async schedulePrimary(schedule: Schedule, plannedTime: number) {
        const id = generateNotificationId('primary', schedule.id, String(plannedTime))

        await notificationAPI.schedule({
            id,
            title: 'Время приёма',
            body: 'Пора принять препарат',
            timestamp: plannedTime,
            data: {
                type: 'intake_reminder',
                scheduleId: schedule.id,
                plannedTime: String(plannedTime),
                isRepeatReminder: 'false',
                repeatIndex: '0',
            },
        })

        await notificationRepository.add({
            id,
            scheduleId: schedule.id,
            plannedTime,
            isRepeatReminder: false,
            repeatIndex: 0,
        })

        console.log("[NotificationService:Primary] Scheduled:", id, new Date(plannedTime).toString())
    }

    /*------Schedule Repeat Reminders------*/
    async scheduleRepeats(
        schedule: Schedule,
        plannedTime: number,
        nextIntakeTime: number | null
    ) {
        if (!schedule.repeatReminderEnabled) {
            return
        }

        const repeatInterval = schedule.repeatReminderIntervalMinutes!
        const repeatMaxCount = schedule.repeatReminderMaxCount

        const endOfDay = new Date(plannedTime)
        endOfDay.setHours(23, 59, 59, 999)
        const limitTime = Math.min(
            nextIntakeTime ?? endOfDay.getTime(),
            endOfDay.getTime()
        )

        let repeatIndex = 1

        while (true) {
            /*
            Interval stored in minutes so we convert
            it to miliseconds (*60_000) because timestamp counts in ms
            and Notifee accepts timestamp
            */
            const repeatTime = plannedTime + repeatInterval * repeatIndex * 60_000

            if (repeatTime >= limitTime) {
                break
            }
            if (repeatMaxCount !== null && repeatIndex > repeatMaxCount) {
                break
            }

            const id = generateNotificationId('repeat', schedule.id, String(repeatTime))

            await notificationAPI.schedule({
                id,
                title: 'Напоминание о приёме',
                body: 'Вы не отметили приём',
                timestamp: repeatTime,
                data: {
                    type: 'intake_reminder',
                    scheduleId: schedule.id,
                    plannedTime: String(plannedTime),
                    isRepeatReminder: 'true',
                    repeatIndex: String(repeatIndex),
                },
            })

            await notificationRepository.add({
                id,
                scheduleId: schedule.id,
                plannedTime,
                isRepeatReminder: true,
                repeatIndex,
            })
            repeatIndex++

            console.log("[NotificationService:Repeat] Scheduled:", id, "at", new Date(repeatTime).toString())
        }
    }

    /*------Schedule Reminders for user_dalayed action------*/
    async ScheduleSnoozed(
        schedule: Schedule,
        plannedTime: number,
    ) {
        const repeatInterval = schedule.repeatReminderEnabled
            ? schedule.repeatReminderIntervalMinutes!
            : 120 /*set default interval for single reminder for 2 hours*/

        const snoozeTime = Date.now() + repeatInterval * 60_000

        const id = generateNotificationId('snooze', schedule.id, String(snoozeTime))

        await notificationAPI.schedule({
            id,
            title: 'Отложенное напоминание',
            body: 'Пора принять препарат',
            timestamp: snoozeTime,
            data: {
                type: 'intake_reminder',
                scheduleId: schedule.id,
                plannedTime: String(plannedTime),
                isRepeatReminder: 'false',
                repeatIndex: '0',
                isSnoozed: 'true',
            },
        })

        await notificationRepository.add({
            id,
            scheduleId: schedule.id,
            plannedTime,
            isRepeatReminder: false,
            repeatIndex: 0,
            isSnoozed: true,
        })

        console.log("[NotificationService:Snooze] Scheduled:", id, "at", new Date(snoozeTime).toString())
    }

    /*------Cancel notification if Intake is marked as taken-----*/
    async cancelForIntake(scheduleId: string, plannedTime: number) {
        const list = await notificationRepository.findByScheduleAndTime(scheduleId, plannedTime)
        for (const n of list) {
            await notificationAPI.cancelSchedule(n.id)
            await notificationRepository.remove(n.id)
        }
        console.log("[NotificationService:CancelForIntake] Cancelled for", scheduleId, plannedTime)
    }

    /*------Schedule next reminder for Intake (primary and repeat)------*/
    async planNext(schedule: Schedule) {
        /*check unmarked intakes*/
        const now = Date.now()
        const plannedTimes = getPastIntakes(schedule)
        intakeService.checkMissed(schedule, plannedTimes)

        const nextTime = getNextIntake(schedule)
        const nextAfterPrimary = getNextIntakeTimeAfter(schedule, nextTime)

        if (nextTime) {
            await this.schedulePrimary(schedule, nextTime)
            await this.scheduleRepeats(schedule, nextTime, nextAfterPrimary)
        }

        console.log("[NotificationService:PlanNext] Next intake:", nextTime ? new Date(nextTime).toString() : "none")
    }

    /*------Create Notification for schedule------*/
    async onScheduleCreated(schedule: Schedule) {
        await this.planNext(schedule)
    }

    /*------Recreate notifications for schedule------*/
    async scheduleForSchedule(schedule: Schedule) {
        await this.planNext(schedule)
    }

    /*------Cancel all notifications for schedule------*/
    async cancelForSchedule(scheduleId: string) {
        const all = await notificationRepository.getAll()
        const related = all.filter(n => n.scheduleId === scheduleId)

        for (const n of related) {
            await notificationAPI.cancelSchedule(n.id)
            await notificationRepository.remove(n.id)
        }

        console.log("[NotificationService:CancelForSchedule] Cancelled all for", scheduleId)
    }

    async cancelAll() {
        const all = await notificationRepository.getAll()
        for (const n of all) {
            await notificationAPI.cancelSchedule(n.id)
            console.log("[NotificationService:cancelAll] Cancel notification:", n.id)
        }
        await notificationRepository.saveAll([])
    }

}

export const notificationService = new NotificationService()