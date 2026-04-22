/* Manage:
    - schedule list
    - add schedule
    - remove schedule
    - update schedule
*/

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Schedule } from "../../shared/types/Schedule";
import { notificationService } from "../../shared/notifications/NotificationService";

interface SchedulesState {
    list: Schedule[]
}

const initialState: SchedulesState = {
    list: [],
}

export const schedulesSlice = createSlice({
    name: 'schedules',
    initialState,
    reducers: {
        addSchedule: (state, action: PayloadAction<Schedule>) => {
            state.list.push(action.payload)
        },
        removeSchedule: (state, action: PayloadAction<string>) => {
            state.list = state.list.filter(s => s.id !== action.payload)
        },
        updateSchedule: (state, action: PayloadAction<Schedule>) => {
            const index = state.list.findIndex(s => s.id === action.payload.id)
            if (index !== -1) {
                state.list[index] = action.payload
            }
        },
    },
})

export const { addSchedule, removeSchedule, updateSchedule } = schedulesSlice.actions
export const schedulesReducer = schedulesSlice.reducer

export const createScheduleThunk = createAsyncThunk(
    'schedules/create',
    async (schedule: Schedule, { dispatch }) => {
        dispatch(addSchedule(schedule))
        await notificationService.onScheduleCreated(schedule)
    }
)

export const updateScheduleThunk = createAsyncThunk(
    'schedules/update',
    async (schedule: Schedule, { dispatch }) => {
        dispatch(updateSchedule(schedule))
        await notificationService.cancelForSchedule(schedule.id)
        await notificationService.onScheduleCreated(schedule)
    }
)

export const removeScheduleThunk = createAsyncThunk(
    'schedules/remove',
    async (scheduleId: string, { dispatch }) => {
        dispatch(removeSchedule(scheduleId))
        await notificationService.cancelForSchedule(scheduleId)
    }
)