// import { configureStore } from "@reduxjs/toolkit";
// import customerReducer from "./slices/customerSlice";

// export const store = configureStore({
//   reducer: {
//     customer: customerReducer,
//   },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;



import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "./slices/customerSlice";
import itemReducer from "./slices/itemSlice";

export const store = configureStore({
  reducer: {
    customer: customerReducer,
    item: itemReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
