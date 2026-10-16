
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface Order {
  orderId: string;
  total: number;
  customerId: string;
}

export interface OrderItemDetails {
  quantity: number;
  orderId: string;
  itemId: string;
}

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

// Get all orders
export const getOrders = createAsyncThunk(
  "order/getOrders",
  async () => {
    const response = await axios.get(
      "http://localhost:8080/api/orders"
    );
    return response.data as Order[];
  }
);

// Add an order
export const addOrder = createAsyncThunk(
  "order/addOrder",
  async (order: Order) => {
    const response = await axios.post(
      "http://localhost:8080/api/orders",
      order
    );
    return response.data as Order;
  }
);

// Add item details to an order
export const addOrderItemDetails = createAsyncThunk(
  "order/addOrderItemDetails",
  async (details: OrderItemDetails) => {
    const response = await axios.post(
      "http://localhost:8080/api/order-items",
      details
    );
    return response.data;
  }
);

// Delete an order
export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  async (orderId: string) => {
    await axios.delete(
      `http://localhost:8080/api/orders/${orderId}`
    );
    return orderId;
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load orders";
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          (order) => order.orderId !== action.payload
        );
      });
  },
});

export default orderSlice.reducer;
