
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface Item {
  itemId: string;
  itemName: string;
  quantity: number;
  price: number;
}

interface ItemState {
  items: Item[];
  loading: boolean;
  error: string | null;
}

const initialState: ItemState = {
  items: [],
  loading: false,
  error: null,
};

// Get all items
export const getItems = createAsyncThunk(
  "item/getItems",
  async () => {
    const response = await axios.get(
      "http://localhost:8080/api/items"
    );

    return response.data;
  }
);

// Add a new item
export const addItem = createAsyncThunk(
  "item/addItem",
  async (item: Item) => {
    const response = await axios.post(
      "http://localhost:8080/api/items",
      item
    );

    return response.data;
  }
);

// Update an item
export const updateItem = createAsyncThunk(
  "item/updateItem",
  async (item: Item) => {
    const response = await axios.put(
      `http://localhost:8080/api/items/${item.itemId}`,
      item
    );

    return response.data;
  }
);

// Delete an item
export const deleteItem = createAsyncThunk(
  "item/deleteItem",
  async (itemId: string) => {
    await axios.delete(
      `http://localhost:8080/api/items/${itemId}`
    );

    return itemId;
  }
);

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getItems.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load items";
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const updatedItem = action.payload;

        const index = state.items.findIndex(
          (item) => item.itemId === updatedItem.itemId
        );

        if (index !== -1) {
          state.items[index] = updatedItem;
        }
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.itemId !== action.payload
        );
      });
  },
});

export default itemSlice.reducer;
