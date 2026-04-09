import { combineReducers } from "@reduxjs/toolkit";
import { baseApi } from '../../shared/api/baseApi';
import { productsReducer } from "../../features/products/productsSlice";
import { schedulesReducer } from "../../features/schedules/schedulesSlice";

export const rootReducer = combineReducers({
    products: productsReducer,
    schedules: schedulesReducer,
    [baseApi.reducerPath]: baseApi.reducer,
})