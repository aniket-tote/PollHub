import { configureStore } from "@reduxjs/toolkit";
import colorModeReducer from "./slices/colorMode";

export const store = configureStore({
  reducer: {
    colorModeReducer: colorModeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
