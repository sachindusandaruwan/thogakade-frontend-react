
import { useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "../../store/store";
import { addCustomer } from "../../store/slices/customerSlice";

function AddCustomerForm() {
  const dispatch = useDispatch<AppDispatch>();

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const clearForm = () => {
    setId("");
    setName("");
    setAddress("");
    setPhone("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id.trim() || !name.trim() || !address.trim() || !phone.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    setSaving(true);

    try {
      await dispatch(
        addCustomer({
          id: id.trim(),
          name: name.trim(),
          address: address.trim(),
          phone: phone.trim(),
        })
      ).unwrap();

      alert("Customer added successfully!");
      clearForm();
    } catch (error) {
      console.error("Failed to add customer:", error);
      alert("Failed to add customer. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h3 style={titleStyle}>New Customer</h3>
          <p style={subtitleStyle}>
            Enter the customer details below.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={gridStyle}>
          <div style={fieldStyle}>
            <label htmlFor="customer-id" style={labelStyle}>
              Customer ID
            </label>
            <input
              id="customer-id"
              type="text"
              placeholder="e.g. C004"
              value={id}
              onChange={(e) => setId(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="customer-name" style={labelStyle}>
              Customer Name
            </label>
            <input
              id="customer-name"
              type="text"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="customer-address" style={labelStyle}>
              Address
            </label>
            <input
              id="customer-address"
              type="text"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="customer-phone" style={labelStyle}>
              Phone Number
            </label>
            <input
              id="customer-phone"
              type="tel"
              placeholder="e.g. 0712345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
        </div>

        <div style={buttonRowStyle}>
          <button
            type="submit"
            style={saveButtonStyle}
            disabled={saving}
          >
            {saving ? "Saving Customer..." : "+ Save Customer"}
          </button>

          <button
            type="button"
            style={clearButtonStyle}
            onClick={clearForm}
            disabled={saving}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

const containerStyle: CSSProperties = {
  padding: "8px 0",
  color: "#334155",
};

const headerStyle: CSSProperties = {
  marginBottom: "24px",
};

const titleStyle: CSSProperties = {
  fontSize: "22px",
  fontWeight: 700,
  color: "#0f172a",
  margin: "0 0 6px",
};

const subtitleStyle: CSSProperties = {
  fontSize: "14px",
  color: "#64748b",
  margin: 0,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
};

const fieldStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const labelStyle: CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#475569",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  fontSize: "14px",
  backgroundColor: "#ffffff",
  color: "#0f172a",
  boxSizing: "border-box",
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  gap: "12px",
  marginTop: "28px",
  flexWrap: "wrap",
};

const saveButtonStyle: CSSProperties = {
  padding: "12px 22px",
  backgroundColor: "#2563eb",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  fontWeight: 600,
  cursor: "pointer",
};

const clearButtonStyle: CSSProperties = {
  padding: "12px 22px",
  backgroundColor: "#e2e8f0",
  color: "#334155",
  border: "none",
  borderRadius: "8px",
  fontWeight: 600,
  cursor: "pointer",
};

export default AddCustomerForm;
