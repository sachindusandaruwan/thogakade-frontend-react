
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  getCustomers,
  updateCustomer,
  deleteCustomer,
} from "../store/slices/customerSlice";
import AddCustomerForm from "../components/customer/AddCustomerForm";

interface Customer {
  id: string;
  name: string;
  address: string;
  phone: string;
}

function CustomerPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { customers, loading, error } = useSelector(
    (state: RootState) => state.customer
  );

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

    const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCustomer) return;

    try {
      await dispatch(updateCustomer(selectedCustomer)).unwrap();

      setSelectedCustomer(null);
      alert("Customer updated successfully!");
    } catch {
      alert("Failed to update customer.");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmed) return;

    try {
      await dispatch(deleteCustomer(id)).unwrap();

      if (selectedCustomer?.id === id) {
        setSelectedCustomer(null);
      }

      alert("Customer deleted successfully!");
    } catch {
      alert("Failed to delete customer.");
    }
  };

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Customer Management</h1>

      <AddCustomerForm />

      <h2>Customers</h2>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}


<table
  style={{
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  }}
>
  <thead>
    <tr>
      <th style={cellStyle}>ID</th>
      <th style={cellStyle}>Name</th>
      <th style={cellStyle}>Address</th>
      <th style={cellStyle}>Phone</th>
      <th style={{ ...cellStyle, width: "180px" }}>
        Action
      </th>
    </tr>
  </thead>

  <tbody>
    {customers.map((customer) => (
      <tr key={customer.id}>
        <td style={cellStyle}>{customer.id}</td>
        <td style={cellStyle}>{customer.name}</td>
        <td style={cellStyle}>{customer.address}</td>
        <td style={cellStyle}>{customer.phone}</td>
        <td style={cellStyle}>
          
<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
  <button
    type="button"
    onClick={() => setViewCustomer(customer)}
  >
    View
  </button>

  <button
    type="button"
    onClick={() => setSelectedCustomer(customer)}
  >
    Edit
  </button>

  <button
    type="button"
    onClick={() => handleDelete(customer.id)}
  >
    Delete
  </button>
</div>
        </td>
      </tr>
    ))}
  </tbody>
</table>


{viewCustomer && (
  <div style={{ border: "1px solid #ccc", padding: "20px", marginTop: "20px" }}>
    <h3>Customer Details</h3>

    <p><strong>ID:</strong> {viewCustomer.id}</p>
    <p><strong>Name:</strong> {viewCustomer.name}</p>
    <p><strong>Address:</strong> {viewCustomer.address}</p>
    <p><strong>Phone:</strong> {viewCustomer.phone}</p>

    <button
      type="button"
      onClick={() => setViewCustomer(null)}
    >
      Close
    </button>
  </div>
)}

      {selectedCustomer && (
        <div style={{ marginTop: "30px" }}>
          <h2>Edit Customer</h2>

          <form onSubmit={handleUpdate}>
            <div style={formRowStyle}>
              <label>ID</label>
              <input
                type="text"
                value={selectedCustomer.id}
                disabled
              />
            </div>

            <div style={formRowStyle}>
              <label>Name</label>
              <input
                type="text"
                value={selectedCustomer.name}
                onChange={(e) =>
                  setSelectedCustomer({
                    ...selectedCustomer,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div style={formRowStyle}>
              <label>Address</label>
              <input
                type="text"
                value={selectedCustomer.address}
                onChange={(e) =>
                  setSelectedCustomer({
                    ...selectedCustomer,
                    address: e.target.value,
                  })
                }
              />
            </div>

            <div style={formRowStyle}>
              <label>Phone</label>
              <input
                type="text"
                value={selectedCustomer.phone}
                onChange={(e) =>
                  setSelectedCustomer({
                    ...selectedCustomer,
                    phone: e.target.value,
                  })
                }
              />
            </div>

            <button type="submit">
              Update Customer
            </button>

            <button
              type="button"
              style={{ marginLeft: "8px" }}
              onClick={() => setSelectedCustomer(null)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

const cellStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "10px",
};

const formRowStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  marginBottom: "12px",
  maxWidth: "300px",
};

export default CustomerPage;