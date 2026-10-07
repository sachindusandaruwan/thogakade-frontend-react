import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store/store";
import { getCustomers } from "./store/slices/customerSlice";
import CustomerPage from "./pages/CustomerPage";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  const { customers, loading, error } = useSelector(
    (state: RootState) => state.customer
  );

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  return <CustomerPage />;
}

export default App;