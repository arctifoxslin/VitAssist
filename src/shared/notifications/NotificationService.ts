import { notificationAPI } from "./notificationAPI";
import { notificationRepository } from "./NotificationRepository";
import { Schedule } from "../types/Schedule";
import { generateNotificationId } from "../../features/notifications/id";
import { getNextIntake } from "../utils/generatePlannedIntakes";
import { productRepository } from "../product/ProductRepository";
import { store } from "../../app/store/store";
import { intakeRepository } from "../intake/IntakeRepository";
import { NotificationData } from "../types/Notification";

class NotificationService {
    /*------Schedule Primary Notifications------*/
    async schedulePrimary(schedule: Schedule, plannedTime: number) {
        const id = generateNotificationId('intake', schedule.id, String(plannedTime))
        const product = await productRepository.getById(schedule.productId)
        const productName = product?.name ?? "препарат"

        await notificationAPI.cancelSchedule(id)
        await notificationRepository.remove(id)


        await notificationAPI.schedule({
            id,
            title: 'Время приёма',
            body: `Пора принять ${productName}`,
            timestamp: plannedTime,
            data: {
                type: 'primary',
                scheduleId: schedule.id,
                plannedTime: String(plannedTime),
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
        repeatIndex: number,
    ) {
        if (!schedule.repeatReminderEnabled) return

        const repeatInterval = schedule.repeatReminderIntervalMinutes!
        const repeatMaxCount = schedule.repeatReminderMaxCount

        if (repeatMaxCount !== null && repeatIndex > repeatMaxCount) return

        const repeatTime = plannedTime + repeatInterval * repeatIndex * 60_000

        const now = Date.now()
        if (repeatTime <= now) return

        const id = generateNotificationId('intake', schedule.id, String(plannedTime))
        const product = await productRepository.getById(schedule.productId)
        const productName = product?.name ?? "препарата"

        await notificationAPI.cancelSchedule(id)
        await notificationRepository.remove(id)

        await notificationAPI.schedule({
            id,
            title: 'Напоминание о приёме',
            body: `Вы не отметили приём ${productName}`,
            timestamp: repeatTime,
            data: {
                type: 'repeat',
                scheduleId: schedule.id,
                plannedTime: String(plannedTime),
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

        console.log("[NotificationService:Repeat] Scheduled:", id, "at", new Date(repeatTime).toString())

    }

    /*------Schedule Reminders for user_dalayed action------*/
    async scheduleSnoozed(
        schedule: Schedule,
        plannedTime: number,
    ) {
        const repeatInterval = schedule.repeatReminderEnabled
            ? schedule.repeatReminderIntervalMinutes!
            : 120 /*set default interval for single reminder for 2 hours*/
        const snoozeTime = Date.now() + repeatInterval * 60_000

        const id = generateNotificationId('snooze', schedule.id, String(plannedTime))
        const product = await productRepository.getById(schedule.productId)
        const productName = product?.name ?? "препарат"

        await notificationAPI.cancelSchedule(id)
        await notificationRepository.remove(id)

        await notificationAPI.schedule({
            id,
            title: 'Отложенное напоминание',
            body: `Пора принять ${productName}`,
            timestamp: snoozeTime,
            data: {
                type: 'snooze',
                scheduleId: schedule.id,
                plannedTime: String(plannedTime),
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
        const nextTime = getNextIntake(schedule)
        if (!nextTime) return

        await this.schedulePrimary(schedule, nextTime)

        console.log("[NotificationService:PlanNext] Next intake:", new Date(nextTime).toString())
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

    async onNotificationRecieved(data: NotificationData) {
        if (
            data.type === 'primary' ||
            data.type === 'repeat' ||
            data.type === 'snooze'
        ) {
            const scheduleId = data.scheduleId
            const plannedTime = Number(data.plannedTime)
            const repeatIndex = Number(data.repeatIndex)
            const schedule = store.getState().schedules.list.find(s => s.id === scheduleId)
            if (!schedule) return

            const intake = await intakeRepository.findByScheduleAndTime(scheduleId, plannedTime)

            if (intake?.status === "taken") {
                await this.cancelForIntake(scheduleId, plannedTime)
                return
            }

            if (data.type === "primary") {
                await this.scheduleRepeats(schedule, plannedTime, 1)
            }

            if (data.type === "repeat") {
                await this.scheduleRepeats(schedule, plannedTime, repeatIndex + 1)
            }

            if (data.type === "snooze") {
                await this.scheduleRepeats(schedule, plannedTime, 1)
            }
        }
    }

}

export const notificationService = new NotificationService()