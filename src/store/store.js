import { configureStore } from '@reduxjs/toolkit';
import registrationReducer from './slices/registrationSlice';
import loginReducer from './slices/loginSlice';
import homeReducer from './slices/homeSlice';
import topupReducer from './slices/topupSlice';
import transactionReducer from './slices/transactionSlice';
import profileReducer from './slices/profileSlice';
import paymentReducer from './slices/paymentSlice';

export const store = configureStore({
    reducer: {
        registration: registrationReducer,
        login: loginReducer,
        home: homeReducer,
        topup: topupReducer,
        transaction: transactionReducer,
        profile: profileReducer,
        payment: paymentReducer
    }
});

export default store;
