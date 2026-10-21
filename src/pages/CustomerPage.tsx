
import { useEffect, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "../store/store";
import {
  getCustomers,
  updateCustomer,
  deleteCustomer,
} from "../store/slices/customerSlice";
import AddCustomerForm from "../components/customer/AddCustomerForm";
import type { Customer } from "../types/customer";

export default function CustomerPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { customers, loading, error } = useSelector(
    (state: RootState) => state.customer
  );

  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);
  const [viewCustomer, setViewCustomer] =
    useState<Customer | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  const filteredCustomers = customers.filter((customer) => {
    const query = search.toLowerCase();

    return (
      customer.id.toLowerCase().includes(query) ||
      customer.name.toLowerCase().includes(query) ||
      customer.address.toLowerCase().includes(query) ||
      String(customer.phone).includes(query)
    );
  });

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    setSaving(true);
    try {
      await dispatch(updateCustomer(selectedCustomer)).unwrap();
      setSelectedCustomer(null);
      alert("Customer updated successfully!");
    } catch {
      alert("Failed to update customer.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this customer?")) return;

    try {
      await dispatch(deleteCustomer(id)).unwrap();
      if (selectedCustomer?.id === id) setSelectedCustomer(null);
      if (viewCustomer?.id === id) setViewCustomer(null);
      alert("Customer deleted successfully!");
    } catch {
      alert("Failed to delete customer. It may have related orders.");
    }
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={{ margin: 0, color: "#0f172a" }}>
            Customer Management
          </h1>
          <p style={{ color: "#64748b" }}>
            Manage your customers and their information
          </p>
        </div>

        <button
          type="button"
          style={primaryButton}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Close Form" : "+ Add Customer"}
        </button>
      </div>

      <div style={statCard}>
        <p style={{ margin: 0, color: "#64748b" }}>
          Total Customers
        </p>
        <h2 style={{ margin: "8px 0 0", color: "#0f172a" }}>
          {customers.length}
        </h2>
      </div>

      {showAddForm && (
        <div style={panelStyle}>
          <h2 style={{ color: "#0f172a" }}>Add New Customer</h2>
          <AddCustomerForm />
        </div>
      )}

      <div style={panelStyle}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0, color: "#0f172a" }}>
            Customer List
          </h2>

          <input
            type="text"
            placeholder="Search by name, ID, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchStyle}
          />
        </div>

        {loading && <p>Loading customers...</p>}
        {error && <p style={{ color: "#dc2626" }}>{error}</p>}

        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Customer ID</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Address</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td style={tdStyle}>{customer.id}</td>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>
                    {customer.name}
                  </td>
                  <td style={tdStyle}>{customer.address}</td>
                  <td style={tdStyle}>{customer.phone}</td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        type="button"
                        style={viewButton}
                        onClick={() => setViewCustomer(customer)}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        style={editButton}
                        onClick={() =>
                          setSelectedCustomer({ ...customer })
                        }
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        style={deleteButton}
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

          {!loading && filteredCustomers.length === 0 && (
            <p style={{ textAlign: "center", color: "#64748b" }}>
              No customers found.
            </p>
          )}
        </div>
      </div>

      {viewCustomer && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ color: "#0f172a" }}>Customer Details</h2>
            <p><strong>ID:</strong> {viewCustomer.id}</p>
            <p><strong>Name:</strong> {viewCustomer.name}</p>
            <p><strong>Address:</strong> {viewCustomer.address}</p>
            <p><strong>Phone:</strong> {viewCustomer.phone}</p>

            <button
              type="button"
              style={primaryButton}
              onClick={() => setViewCustomer(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {selectedCustomer && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ color: "#0f172a" }}>Edit Customer</h2>

            <form onSubmit={handleUpdate}>
              <label style={labelStyle}>Customer ID</label>
              <input
                style={inputStyle}
                value={selectedCustomer.id}
                disabled
              />

              <label style={labelStyle}>Name</label>
              <input
                style={inputStyle}
                value={selectedCustomer.name}
                onChange={(e) =>
                  setSelectedCustomer({
                    ...selectedCustomer,
                    name: e.target.value,
                  })
                }
                required
              />

              <label style={labelStyle}>Address</label>
              <input
                style={inputStyle}
                value={selectedCustomer.address}
                onChange={(e) =>
                  setSelectedCustomer({
                    ...selectedCustomer,
                    address: e.target.value,
                  })
                }
                required
              />

              <label style={labelStyle}>Phone</label>
              <input
                style={inputStyle}
                value={selectedCustomer.phone}
                onChange={(e) =>
                  setSelectedCustomer({
                    ...selectedCustomer,
                    phone: e.target.value,
                  })
                }
                required
              />

              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button
                  type="submit"
                  style={primaryButton}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Update Customer"}
                </button>

                <button
                  type="button"
                  style={secondaryButton}
                  onClick={() => setSelectedCustomer(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const pageStyle: CSSProperties = {
  padding: "30px",
  backgroundColor: "#f3f6fb",
  minHeight: "100vh",
  color: "#334155",
};

const headerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  flexWrap: "wrap",
  marginBottom: "20px",
};

const statCard: CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  padding: "24px",
  marginBottom: "25px",
  maxWidth: "260px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
};

const panelStyle: CSSProperties = {
  backgroundColor: "#fff",
  padding: "24px",
  borderRadius: "12px",
  marginBottom: "25px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
};

const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left",
};

const thStyle: CSSProperties = {
  padding: "14px",
  backgroundColor: "#f8fafc",
  color: "#475569",
  borderBottom: "1px solid #e2e8f0",
};

const tdStyle: CSSProperties = {
  padding: "14px",
  borderBottom: "1px solid #e2e8f0",
  color: "#334155",
};

const buttonBase: CSSProperties = {
  padding: "9px 14px",
  borderRadius: "7px",
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
};

const primaryButton: CSSProperties = {
  ...buttonBase,
  backgroundColor: "#2563eb",
  color: "#fff",
};

const secondaryButton: CSSProperties = {
  ...buttonBase,
  backgroundColor: "#e2e8f0",
  color: "#334155",
};

const viewButton: CSSProperties = {
  ...buttonBase,
  backgroundColor: "#dbeafe",
  color: "#1d4ed8",
};

const editButton: CSSProperties = {
  ...buttonBase,
  backgroundColor: "#fef3c7",
  color: "#92400e",
};

const deleteButton: CSSProperties = {
  ...buttonBase,
  backgroundColor: "#fee2e2",
  color: "#b91c1c",
};

const searchStyle: CSSProperties = {
  padding: "11px 14px",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  width: "260px",
  backgroundColor: "#fff",
  color: "#0f172a",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  marginBottom: "14px",
  border: "1px solid #cbd5e1",
  borderRadius: "7px",
  boxSizing: "border-box",
  backgroundColor: "#fff",
  color: "#0f172a",
};

const labelStyle: CSSProperties = {
  display: "block",
  fontWeight: 600,
  color: "#475569",
};

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(15,23,42,0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "16px",
};

const modalStyle: CSSProperties = {
  backgroundColor: "#fff",
  padding: "28px",
  borderRadius: "14px",
  width: "100%",
  maxWidth: "460px",
  maxHeight: "85vh",
  overflowY: "auto",
  boxSizing: "border-box",
  color: "#334155",
};
