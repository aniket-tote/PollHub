import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  colorMode: "dark",
};

export const colorModeSlice = createSlice({
  name: "colorMode",
  initialState,
  reducers: {
    toggleColorMode: (state) => {
      state.colorMode === "dark"
        ? (state.colorMode = "light")
        : (state.colorMode = "dark");
    },
  },
});

export const { toggleColorMode } = colorModeSlice.actions;
export default colorModeSlice.reducer;
