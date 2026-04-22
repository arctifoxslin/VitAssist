/*
    Intake Repository stores all intake's marks data
    and allows:
        get/save all intakes
        add new intake,
        check if intake exists
        find intake by schedule id or planned time
*/
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Intake } from "../types/Intake";

const KEY = 'intakes'

class IntakeRepository {
    /*------Get stored intakes------*/
    async getAll(): Promise<Intake[]> {
        const raw = await AsyncStorage.getItem(KEY)
        return raw ? JSON.parse(raw) : []
    }

    /*------Save intakes to store------*/
    async saveAll(list: Intake[]) {
        await AsyncStorage.setItem(KEY, JSON.stringify(list))
    }

    /*------Add new intakes to store------*/
    async add(item: Intake) {
        const list = await this.getAll()
        list.push(item)
        await this.saveAll(list)
    }

    /*------Check if intake exist in store by schedule and time------*/
    async checkIntakeExists(scheduleId: string, plannedTime: number) {
        const list = await this.getAll()
        return list.some(
            i => i.scheduleId === scheduleId && i.plannedFor === plannedTime
        )
    }

    /*------Find intake in store by schedule------*/
    async findBySchedule(scheduleId: string) {
        const list = await this.getAll()
        return list.filter(i => i.scheduleId === scheduleId)
    }

    /*------Find intake in store by schedule and time------*/
    async findByScheduleAndTime(scheduleId: string, plannedTime: number) {
        const list = await this.getAll()
        return list.find(i =>
            i.scheduleId === scheduleId && i.plannedFor === plannedTime
        )
    }

    /*------Find intake in store by day------*/
    async findByDay(date: number) {
        const list = await this.getAll()
        const start = new Date(date).setHours(0, 0, 0, 0)
        const end = new Date(date).setHours(23, 59, 59, 999)
        return list.filter(i => i.plannedFor >= start && i.plannedFor <= end)
    }
}

export const intakeRepository = new IntakeRepository()