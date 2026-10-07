import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface Customer {
  id: string;
  name: string;
  address: string;
  phone: string;
}

interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  customers: [],
  loading: false,
  error: null,
};

// Get all customers
export const getCustomers = createAsyncThunk(
  "customer/getCustomers",
  async () => {
    const response = await axios.get(
      "http://localhost:8080/api/customers"
    );

    return response.data;
  }
);

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })

      .addCase(getCustomers.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load customers";
      });
  },
});

export default customerSlice.reducer;