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

//add a new customer
export const addCustomer = createAsyncThunk(
  "customer/addCustomer",
  async (customer: Customer) => {
    const response = await axios.post(
      "http://localhost:8080/api/customers",
      customer
    );

    return response.data;
  }
);

//update a customer
export const updateCustomer = createAsyncThunk(
  "customer/updateCustomer",
  async (customer: Customer) => {
    const response = await axios.put(
      `http://localhost:8080/api/customers/${customer.id}`,
      customer
    );

    return response.data;
  }
);

//delete a customer
export const deleteCustomer = createAsyncThunk(
  "customer/deleteCustomer",
  async (id: string) => {
    await axios.delete(`http://localhost:8080/api/customers/${id}`);
    return id;
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
      })

      .addCase(addCustomer.fulfilled, (state, action) => {
        state.customers.push(action.payload);
      })

      .addCase(updateCustomer.fulfilled, (state, action) => {
        const updatedCustomer = action.payload;

        const index = state.customers.findIndex(
        (customer) => customer.id === updatedCustomer.id
      );

      

      if (index !== -1) {
      state.customers[index] = updatedCustomer;
    }
  })
  .addCase(deleteCustomer.fulfilled, (state, action) => {
  state.customers = state.customers.filter(
    (customer) => customer.id !== action.payload
  );
});
      
  },
});

export default customerSlice.reducer;