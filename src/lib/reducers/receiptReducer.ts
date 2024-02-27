import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { stat } from 'fs';

type Product = {
  name: string;
  quantity: number | null;
  price: number;
  options: {
    offer: string;
    color: string;
    size: string;
  };
};

type ReceiptState = {
  products: Product[];
  deliveryPrice: string;
  userName: string;
  nation: string;
  commune: string;
  phone: string;
  isFirstSubmission: boolean;
  currencySymbol: string;
};

const initialState: ReceiptState = {
  products: [],
  deliveryPrice: '',
  userName: '',
  nation: '',
  commune: '',
  phone: '',
  currencySymbol: '',
  isFirstSubmission: true,
};

const receiptSlice = createSlice({
  name: 'receipt',
  initialState,
  reducers: {
    setupInitialReceipt: (
      state,
      action: PayloadAction<Omit<ReceiptState, 'isFirstSubmission'>>
    ) => {
      if (state.isFirstSubmission) {
        // Set the initial state
        Object.assign(state, action.payload);
        state.isFirstSubmission = false;
      }
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      if (!state.isFirstSubmission) {
        // Add product to the existing state
        state.products.push(action.payload);
      }
    },
  },
});

export const { setupInitialReceipt, addProduct } = receiptSlice.actions;
export default receiptSlice.reducer;
