import { intakeRepository } from "./IntakeRepository";
import { notificationService } from "../notifications/NotificationService";
import uuid from 'react-native-uuid';
import { Schedule } from "../types/Schedule";
import { formatTimeFromTimestamp } from "../utils/formatTimeFromTimestamp";

class IntakeService {
    /*------User pressed taken------*/
    async markTaken(schedule: Schedule, plannedTime: number) {
        await notificationService.cancelForIntake(schedule.id, plannedTime)

        await intakeRepository.add({
            id: uuid.v4.toString(),
            scheduleId: schedule.id,
            productId: schedule.productId,
            plannedFor: plannedTime,
            time: formatTimeFromTimestamp(plannedTime),
            actualTime: Date.now(),
            status: 'taken',
            createdAt: Date.now(),
        })

        await notificationService.planNext(schedule)
    }

    /*------User pressed skip------*/
    async markSkipped(
        schedule: Schedule,
        plannedTime: number,
        reason: 'not_marked' | 'user_skipped' | 'expired'
    ) {
        await notificationService.cancelForIntake(schedule.id, plannedTime)

        await intakeRepository.add({
            id: uuid.v4.toString(),
            productId: schedule.productId,
            scheduleId: schedule.id,
            time: formatTimeFromTimestamp(plannedTime),
            plannedFor: plannedTime,
            actualTime: null,
            status: 'skipped',
            skipReason: reason,
            createdAt: Date.now(),
        })

        await notificationService.planNext(schedule)
    }

    /*------Auto-check skipped intakes (00:00 or when next intake starts)------*/
    async checkMissed(schedule: Schedule, plannedTimes: number[]) {
        const todayStart = new Date()
        todayStart.setHours(0, 0, 0, 0)
        const todayStartTs = todayStart.getTime()

        for (const plannedTime of plannedTimes) {
            const intake = await intakeRepository.findByScheduleAndTime(
                schedule.id,
                plannedTime,
            )

            if (!intake) {
                await intakeRepository.add({
                    id: uuid.v4.toString(),
                    productId: schedule.productId,
                    scheduleId: schedule.id,
                    time: formatTimeFromTimestamp(plannedTime),
                    plannedFor: plannedTime,
                    actualTime: null,
                    status: 'skipped',
                    skipReason: 'not_marked',
                    createdAt: Date.now(),
                })
                continue
            }

            if (intake.status === "delayed" && plannedTime < todayStartTs) {
                await this.updateIntakeStatus(
                    intake.scheduleId,
                    intake.plannedFor,
                    "skipped",
                    undefined,
                    "expired"
                )
            }
        }
    }

    /*------Update intake status------*/
    async updateIntakeStatus(
        scheduleId: string,
        plannedTime: number,
        status: 'taken' | 'skipped' | 'delayed',
        actualTime?: number,
        skipReason?: 'not_marked' | 'user_skipped' | 'expired' | null
    ) {
        const list = await intakeRepository.getAll()

        const index = list.findIndex(
            i => i.scheduleId === scheduleId && i.plannedFor === plannedTime
        )

        if (index === -1) return

        list[index] = {
            ...list[index],
            status,
            actualTime: actualTime ?? list[index].actualTime,
            skipReason: skipReason ?? null,
        }

        await intakeRepository.saveAll(list)

        await notificationService.cancelForIntake(scheduleId, plannedTime)
    }

    /*------Get intakes for current day------*/
    async getIntakesForDay(date: number) {
        return await intakeRepository.findByDay(date)
    }

    /*------Get intake's history for schedule------*/
    async getHistory(scheduleId: string) {
        const list = await intakeRepository.findBySchedule(scheduleId)
        return list.sort((a, b) => a.plannedFor - b.plannedFor)
    }
}

export const intakeService = new IntakeService()