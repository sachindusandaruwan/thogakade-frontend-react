
import { useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "../../store/store";
import { addItem } from "../../store/slices/itemSlice";

function AddItemForm() {
  const dispatch = useDispatch<AppDispatch>();

  const [itemId, setItemId] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);

  const clearForm = () => {
    setItemId("");
    setItemName("");
    setQuantity("");
    setPrice("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !itemId.trim() ||
      !itemName.trim() ||
      quantity.trim() === "" ||
      price.trim() === ""
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const itemQuantity = Number(quantity);
    const itemPrice = Number(price);

    if (
      !Number.isInteger(itemQuantity) ||
      itemQuantity < 0 ||
      !Number.isFinite(itemPrice) ||
      itemPrice < 0
    ) {
      alert("Please enter a valid quantity and price.");
      return;
    }

    setSaving(true);

    try {
      await dispatch(
        addItem({
          itemId: itemId.trim(),
          itemName: itemName.trim(),
          quantity: itemQuantity,
          price: itemPrice,
        })
      ).unwrap();

      alert("Item added successfully!");
      clearForm();
    } catch (error) {
      console.error("Failed to add item:", error);
      alert("Failed to add item. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>New Item</h3>
        <p style={subtitleStyle}>
          Enter the item details below to add it to your inventory.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={gridStyle}>
          <div style={fieldStyle}>
            <label htmlFor="item-id" style={labelStyle}>
              Item ID
            </label>
            <input
              id="item-id"
              type="text"
              placeholder="e.g. I004"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="item-name" style={labelStyle}>
              Item Name
            </label>
            <input
              id="item-name"
              type="text"
              placeholder="Enter item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="item-quantity" style={labelStyle}>
              Quantity
            </label>
            <input
              id="item-quantity"
              type="number"
              placeholder="Enter quantity"
              min="0"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="item-price" style={labelStyle}>
              Price (Rs.)
            </label>
            <input
              id="item-price"
              type="number"
              placeholder="Enter price"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
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
            {saving ? "Saving Item..." : "+ Save Item"}
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

export default AddItemForm;
