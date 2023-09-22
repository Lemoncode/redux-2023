import { configureStore } from "@reduxjs/toolkit";
import userProfileReducer from "../features/user-profile/user-profile.slice";

export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
  },
});

// Aquí sacamos el tipo de RootState del state con typeof
export type RootState = ReturnType<typeof store.getState>;
// Y aquí lo mismo sacamos el tipo del dispatch y las acciones del typeof del dispatch
export type AppDispatch = typeof store.dispatch;
