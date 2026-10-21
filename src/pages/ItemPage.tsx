
import { useEffect, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "../store/store";
import {
  getItems,
  updateItem,
  deleteItem,
} from "../store/slices/itemSlice";
import AddItemForm from "../components/item/AddItemForm";
import type { Item } from "../types/item";

export default function ItemPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { items, loading, error } = useSelector(
    (state: RootState) => state.item
  );

  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewItem, setViewItem] = useState<Item | null>(null);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(getItems());
  }, [dispatch]);

  const lowStockCount = items.filter(
    (item) => item.quantity <= 5
  ).length;

  const filteredItems = items.filter((item) => {
    const query = search.toLowerCase();

    return (
      item.itemId.toLowerCase().includes(query) ||
      item.itemName.toLowerCase().includes(query)
    );
  });

  const handleDelete = async (itemId: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      await dispatch(deleteItem(itemId)).unwrap();

      if (viewItem?.itemId === itemId) setViewItem(null);
      if (editItem?.itemId === itemId) setEditItem(null);

      alert("Item deleted successfully!");
    } catch {
      alert("Failed to delete item. It may be used in an order.");
    }
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editItem) return;

    setSaving(true);

    try {
      await dispatch(updateItem(editItem)).unwrap();
      setEditItem(null);
      alert("Item updated successfully!");
    } catch {
      alert("Failed to update item!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={{ margin: 0, color: "#0f172a" }}>
            Item Management
          </h1>
          <p style={{ color: "#64748b" }}>
            Manage your products, prices and stock levels
          </p>
        </div>

        <button
          type="button"
          style={primaryButton}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Close Form" : "+ Add Item"}
        </button>
      </div>

      <div style={statsGrid}>
        <div style={statCard}>
          <p style={statLabel}>Total Items</p>
          <h2 style={statValue}>{items.length}</h2>
        </div>

        <div style={statCard}>
          <p style={statLabel}>Low Stock Items</p>
          <h2 style={{ ...statValue, color: "#dc2626" }}>
            {lowStockCount}
          </h2>
        </div>
      </div>

      {showAddForm && (
        <div style={panelStyle}>
          <AddItemForm />
        </div>
      )}

      <div style={panelStyle}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0, color: "#0f172a" }}>
            Item List
          </h2>

          <input
            type="text"
            placeholder="Search by Item ID or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchStyle}
          />
        </div>

        {loading && <p>Loading items...</p>}
        {error && <p style={{ color: "#dc2626" }}>{error}</p>}

        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Item ID</th>
                <th style={thStyle}>Item Name</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>Price (Rs.)</th>
                <th style={thStyle}>Stock Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((item) => {
                const isOutOfStock = item.quantity === 0;
                const isLowStock = item.quantity > 0 &&
                  item.quantity <= 5;

                const status = isOutOfStock
                  ? "Out of Stock"
                  : isLowStock
                  ? "Low Stock"
                  : "In Stock";

                const statusStyle = isOutOfStock || isLowStock
                  ? warningBadge
                  : successBadge;

                return (
                  <tr key={item.itemId}>
                    <td style={tdStyle}>{item.itemId}</td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>
                      {item.itemName}
                    </td>
                    <td style={tdStyle}>{item.quantity}</td>
                    <td style={tdStyle}>
                      {Number(item.price).toFixed(2)}
                    </td>
                    <td style={tdStyle}>
                      <span style={statusStyle}>{status}</span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          type="button"
                          style={viewButton}
                          onClick={() => setViewItem(item)}
                        >
                          View
                        </button>
                        <button
                          type="button"
                          style={editButton}
                          onClick={() => setEditItem({ ...item })}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          style={deleteButton}
                          onClick={() => handleDelete(item.itemId)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {!loading && filteredItems.length === 0 && (
            <p style={{ textAlign: "center", color: "#64748b" }}>
              No items found.
            </p>
          )}
        </div>
      </div>

      {viewItem && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ color: "#0f172a" }}>Item Details</h2>
            <p><strong>Item ID:</strong> {viewItem.itemId}</p>
            <p><strong>Item Name:</strong> {viewItem.itemName}</p>
            <p><strong>Quantity:</strong> {viewItem.quantity}</p>
            <p>
              <strong>Price:</strong> Rs. {Number(viewItem.price).toFixed(2)}
            </p>

            <button
              type="button"
              style={primaryButton}
              onClick={() => setViewItem(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {editItem && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ color: "#0f172a" }}>Edit Item</h2>

            <form onSubmit={handleUpdate}>
              <label style={labelStyle}>Item ID</label>
              <input
                style={inputStyle}
                value={editItem.itemId}
                disabled
              />

              <label style={labelStyle}>Item Name</label>
              <input
                style={inputStyle}
                value={editItem.itemName}
                onChange={(e) =>
                  setEditItem({
                    ...editItem,
                    itemName: e.target.value,
                  })
                }
                required
              />

              <label style={labelStyle}>Quantity</label>
              <input
                style={inputStyle}
                type="number"
                min="0"
                step="1"
                value={editItem.quantity}
                onChange={(e) =>
                  setEditItem({
                    ...editItem,
                    quantity: Number(e.target.value),
                  })
                }
                required
              />

              <label style={labelStyle}>Price (Rs.)</label>
              <input
                style={inputStyle}
                type="number"
                min="0"
                step="0.01"
                value={editItem.price}
                onChange={(e) =>
                  setEditItem({
                    ...editItem,
                    price: Number(e.target.value),
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
                  {saving ? "Saving..." : "Update Item"}
                </button>
                <button
                  type="button"
                  style={secondaryButton}
                  onClick={() => setEditItem(null)}
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

const statsGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginBottom: "25px",
};

const statCard: CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  padding: "24px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
};

const statLabel: CSSProperties = {
  margin: 0,
  color: "#64748b",
};

const statValue: CSSProperties = {
  margin: "8px 0 0",
  color: "#0f172a",
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

const warningBadge: CSSProperties = {
  backgroundColor: "#fef3c7",
  color: "#92400e",
  padding: "5px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: 600,
};

const successBadge: CSSProperties = {
  backgroundColor: "#dcfce7",
  color: "#166534",
  padding: "5px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: 600,
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
