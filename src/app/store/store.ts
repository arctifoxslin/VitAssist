import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { persistConfig } from './persistConfig';
import { rootReducer } from './rootReducer';
import { baseApi } from '../../shared/api/baseApi';

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
            /*persist put in state special objects
            which are not serializable correctly*/
        }).concat(baseApi.middleware),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;