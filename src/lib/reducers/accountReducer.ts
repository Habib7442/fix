import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type accountSlice = {
  account: string | null;
};

const initialState: accountSlice = {
  account: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccount: (state, action: PayloadAction<string | null>) => {
      state.account = action.payload;
    },
  },
});

export const { fetchAccount } = accountSlice.actions;
export default accountSlice.reducer;
