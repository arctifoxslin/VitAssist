import { combineReducers } from "@reduxjs/toolkit";
import { baseApi } from '../../shared/api/baseApi';
import { productsReducer } from "../../features/products/productsSlice";
import { schedulesReducer } from "../../features/schedules/schedulesSlice";
import { intakeReducer } from "../../features/intake/intakeSlice";

export const rootReducer = combineReducers({
    products: productsReducer,
    schedules: schedulesReducer,
    intake: intakeReducer,
    [baseApi.reducerPath]: baseApi.reducer,
})