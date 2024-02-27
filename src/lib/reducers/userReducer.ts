/* eslint-disable */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  userId: any;
};

const initialState: AuthState = {
  userId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
  },
});

export const { loginUser } = authSlice.actions;
export default authSlice.reducer;
