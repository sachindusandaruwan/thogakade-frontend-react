import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { getCustomers } from "../store/slices/customerSlice";

function CustomerPage() {

  const dispatch = useDispatch<AppDispatch>();

  const { customers, loading, error } = useSelector(
    (state: RootState) => state.customer
  );

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  return (
    <div>
      <h1>Customer Management</h1>

      <h2>Customers</h2>

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.address}</td>
              <td>{customer.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerPage;