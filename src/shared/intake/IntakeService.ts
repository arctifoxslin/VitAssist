import { intakeRepository } from "./IntakeRepository";
import { notificationService } from "../notifications/NotificationService";
import uuid from 'react-native-uuid';
import { Schedule } from "../types/Schedule";
import { formatTimeFromTimestamp } from "../utils/formatTimeFromTimestamp";
import { buildAllPlannedTimes } from "../../features/intake/utils/buildScheduleMatrix";

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
        const now = Date.now()

        for (const plannedTime of plannedTimes) {
            const startOfDay = new Date(plannedTime)
            startOfDay.setHours(0, 0, 0, 0)

            const endOfDay = new Date(plannedTime)
            endOfDay.setHours(23, 59, 59, 999)

            if (now < endOfDay.getTime()) {
                continue
            }

            const intake = await intakeRepository.findByScheduleAndTime(
                schedule.id,
                plannedTime,
            )

            if (intake && intake.status === "delayed") {
                if (now > endOfDay.getTime()) {

                    await this.updateIntakeStatus(
                        intake.scheduleId,
                        intake.plannedFor,
                        "skipped",
                        undefined,
                        "expired"
                    )
                }

                continue
            }

            if (intake) {
                continue
            }

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

    async ensurePastIntakes(schedule: Schedule) {
        const now = Date.now()
        const plannedTimes = buildAllPlannedTimes(schedule)

        for (const plannedTime of plannedTimes) {
            if (plannedTime >= now) continue

            const exists = await intakeRepository.checkIntakeExists(schedule.id, plannedTime)

            if (exists) continue

            await intakeRepository.add({
                id: uuid.v4.toString(),
                productId: schedule.productId,
                scheduleId: schedule.id,
                time: formatTimeFromTimestamp(plannedTime),
                plannedFor: plannedTime,
                actualTime: null,
                status: 'skipped',
                skipReason: "not_marked",
                createdAt: now,
            })
        }
    }
}

export const intakeService = new IntakeService()