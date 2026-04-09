/* Manage:
    - schedule list
    - add schedule
    - remove schedule
    - update schedule
*/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Schedule } from "../../shared/types/Schedule";

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
            if(index !== -1) {
                state.list[index] = action.payload
            }
        },
    },
})

export const { addSchedule, removeSchedule, updateSchedule } = schedulesSlice.actions
export const schedulesReducer = schedulesSlice.reducer