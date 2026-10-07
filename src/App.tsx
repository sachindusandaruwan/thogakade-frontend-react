
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store/store";
import { getCustomers } from "./store/slices/customerSlice";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  const { customers, loading, error } = useSelector(
    (state: RootState) => state.customer
  );

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  return (
    <div>
      <h1>Thogakade POS</h1>

      <h2>Customers</h2>

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {customers.map((customer) => (
        <div key={customer.id}>
          <p>ID: {customer.id}</p>
          <p>Name: {customer.name}</p>
          <p>Address: {customer.address}</p>
          <p>Phone: {customer.phone}</p>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;

