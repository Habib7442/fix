import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type StoreType = {
  store: any;
};

const initialState: StoreType = {
  store: null,
};

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    setStore: (state, action: PayloadAction<any>) => {
      state.store = action.payload;
    },
  },
});

export const { setStore } = storeSlice.actions;
export default storeSlice.reducer;
