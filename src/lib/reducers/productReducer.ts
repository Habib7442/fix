import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Product = any;

type ProductState = {
  products: any;
  productDes: any;
  selectedCategory: string;
  filteredProducts: any;
  orderId: any;
};

const initialState: ProductState = {
  products: [],
  productDes: null,
  selectedCategory: "",
  orderId: null,
  filteredProducts: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    getProducts: (state, action: PayloadAction<any>) => {
      state.products = action.payload;
    },
    getProductDescription: (state, action: PayloadAction<any>) => {
      state.productDes = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<any>) => {
      state.selectedCategory = action.payload;
    },
    fetchFilteredProducts: (state, action: PayloadAction<any>) => {
      state.filteredProducts = action.payload;
    },
    setOrderId: (state, action: PayloadAction<any>) => {
      state.orderId = action.payload.id;
    },
  },
});

export const {
  getProducts,
  getProductDescription,
  setSelectedCategory,
  fetchFilteredProducts,
  setOrderId,
} = productSlice.actions;
export default productSlice.reducer;
