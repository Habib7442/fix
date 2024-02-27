import { configureStore } from "@reduxjs/toolkit";
import accountSlice from "./reducers/accountReducer";
import productSlice from "./reducers/productReducer";
import storeSlice from "./reducers/storeReducer";
import receiptSlice from "./reducers/receiptReducer";
import authSlice from "./reducers/userReducer";

export const makeStore = () => {
  return configureStore({
    reducer: {
      authSlice,
      storeSlice,
      productSlice,
      receiptSlice,
      accountSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
