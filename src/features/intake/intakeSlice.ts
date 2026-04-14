/* Manage:
    - intake list
    - add intake
*/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Intake, IntakeStatus } from "../../shared/types/Intake";

interface IntakeState {
    list: Intake[]
}

const initialState: IntakeState = {
    list: [],
}

export const intakeSlice = createSlice({
    name: 'intake',
    initialState,
    reducers: {
        addIntake: (state, action: PayloadAction<Intake>) => {
            state.list.push(action.payload)
        },
    },
})

export const { addIntake } = intakeSlice.actions
export const intakeReducer = intakeSlice.reducer