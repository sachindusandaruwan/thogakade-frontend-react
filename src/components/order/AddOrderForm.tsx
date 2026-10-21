
import { useEffect, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../store/store";

import {
  addOrder,
  addOrderItemDetails,
} from "../../store/slices/orderSlice";

import { getCustomers } from "../../store/slices/customerSlice";
import { getItems } from "../../store/slices/itemSlice";

interface OrderLine {
  itemId: string;
  quantity: number;
}

export default function AddOrderForm() {
  const dispatch = useDispatch<AppDispatch>();

  const customers = useSelector(
    (state: RootState) => state.customer.customers
  );

  const items = useSelector(
    (state: RootState) => state.item.items
  );

  const [orderId, setOrderId] = useState("");
  const [customerId, setCustomerId] = useState("");

  const [orderLines, setOrderLines] = useState<OrderLine[]>([
    { itemId: "", quantity: 1 },
  ]);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(getCustomers());
    dispatch(getItems());
  }, [dispatch]);

  const updateOrderLine = (
    index: number,
    field: keyof OrderLine,
    value: string | number
  ) => {
    setOrderLines((previous) =>
      previous.map((line, i) =>
        i === index ? { ...line, [field]: value } : line
      )
    );
  };

  const addAnotherItem = () => {
    setOrderLines((previous) => [
      ...previous,
      { itemId: "", quantity: 1 },
    ]);
  };

  const removeItem = (index: number) => {
    setOrderLines((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };

  const clearForm = () => {
    setOrderId("");
    setCustomerId("");
    setOrderLines([{ itemId: "", quantity: 1 }]);
  };

  const grandTotal = orderLines.reduce((sum, line) => {
    const item = items.find(
      (currentItem) => currentItem.itemId === line.itemId
    );

    return sum + (item ? item.price * line.quantity : 0);
  }, 0);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!orderId.trim() || !customerId) {
      alert("Please enter an Order ID and select a customer.");
      return;
    }

    if (
      orderLines.some(
        (line) =>
          !line.itemId ||
          !Number.isInteger(line.quantity) ||
          line.quantity < 1
      )
    ) {
      alert("Please select an item and enter a valid quantity.");
      return;
    }

    const itemIds = orderLines.map((line) => line.itemId);

    if (new Set(itemIds).size !== itemIds.length) {
      alert("The same item cannot be selected twice.");
      return;
    }

    for (const line of orderLines) {
      const item = items.find(
        (currentItem) => currentItem.itemId === line.itemId
      );

      if (!item) {
        alert("One of the selected items was not found.");
        return;
      }

      if (line.quantity > item.quantity) {
        alert(
          `Not enough stock for ${item.itemName}. Available: ${item.quantity}`
        );
        return;
      }
    }

    setSaving(true);

    try {
      await dispatch(
        addOrder({
          orderId: orderId.trim(),
          customerId,
          total: grandTotal,
        })
      ).unwrap();

      for (const line of orderLines) {
        await dispatch(
          addOrderItemDetails({
            orderId: orderId.trim(),
            itemId: line.itemId,
            quantity: line.quantity,
          })
        ).unwrap();
      }

      alert("Order and all items saved successfully!");

      clearForm();
      dispatch(getItems());
    } catch (error) {
      console.error("Order saving failed:", error);
      alert(
        "Saving failed. The order may have been created. Check the backend before retrying."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Create New Order</h2>
        <p style={subtitleStyle}>
          Select a customer, add items and review the total.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={sectionStyle}>
          <h3 style={sectionTitle}>Order Information</h3>

          <div style={infoGridStyle}>
            <div style={fieldStyle}>
              <label htmlFor="order-id" style={labelStyle}>
                Order ID
              </label>
              <input
                id="order-id"
                type="text"
                placeholder="e.g. O004"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                style={inputStyle}
                required
                disabled={saving}
              />
            </div>

            <div style={fieldStyle}>
              <label htmlFor="order-customer" style={labelStyle}>
                Customer
              </label>
              <select
                id="order-customer"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                style={inputStyle}
                required
                disabled={saving}
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.id})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <h3 style={sectionTitle}>Order Items</h3>

            <button
              type="button"
              style={addItemButton}
              onClick={addAnotherItem}
              disabled={saving}
            >
              + Add Another Item
            </button>
          </div>

          {orderLines.map((line, index) => {
            const selectedItem = items.find(
              (item) => item.itemId === line.itemId
            );

            const subtotal = selectedItem
              ? selectedItem.price * line.quantity
              : 0;

            const insufficientStock =
              !!selectedItem &&
              line.quantity > selectedItem.quantity;

            return (
              <div key={index} style={itemRowStyle}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>
                    Item {index + 1}
                  </label>

                  <select
                    value={line.itemId}
                    onChange={(e) =>
                      updateOrderLine(
                        index,
                        "itemId",
                        e.target.value
                      )
                    }
                    style={inputStyle}
                    required
                    disabled={saving}
                  >
                    <option value="">Select Item</option>

                    {items.map((item) => (
                      <option
                        key={item.itemId}
                        value={item.itemId}
                        disabled={orderLines.some(
                          (otherLine, otherIndex) =>
                            otherIndex !== index &&
                            otherLine.itemId === item.itemId
                        )}
                      >
                        {item.itemName} - Rs. {item.price}
                      </option>
                    ))}
                  </select>

                  {selectedItem && (
                    <span style={stockTextStyle}>
                      Available stock: {selectedItem.quantity}
                    </span>
                  )}
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Quantity</label>

                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={line.quantity}
                    onChange={(e) =>
                      updateOrderLine(
                        index,
                        "quantity",
                        Number(e.target.value)
                      )
                    }
                    style={inputStyle}
                    required
                    disabled={saving}
                  />

                  {insufficientStock && (
                    <span style={errorTextStyle}>
                      Insufficient stock
                    </span>
                  )}
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Subtotal</label>
                  <div style={subtotalStyle}>
                    Rs. {subtotal.toFixed(2)}
                  </div>
                </div>

                <div style={removeButtonWrapper}>
                  <button
                    type="button"
                    style={removeButton}
                    onClick={() => removeItem(index)}
                    disabled={
                      orderLines.length === 1 || saving
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={totalBoxStyle}>
          <div>
            <p style={totalLabelStyle}>Grand Total</p>
            <h2 style={totalValueStyle}>
              Rs. {grandTotal.toFixed(2)}
            </h2>
          </div>
        </div>

        <div style={buttonRowStyle}>
          <button
            type="submit"
            style={saveButtonStyle}
            disabled={saving}
          >
            {saving ? "Saving Order..." : "Save Order"}
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
  marginBottom: "25px",
};

const titleStyle: CSSProperties = {
  fontSize: "23px",
  fontWeight: 700,
  color: "#0f172a",
  margin: "0 0 6px",
};

const subtitleStyle: CSSProperties = {
  color: "#64748b",
  fontSize: "14px",
  margin: 0,
};

const sectionStyle: CSSProperties = {
  marginBottom: "28px",
};

const sectionTitle: CSSProperties = {
  fontSize: "17px",
  fontWeight: 700,
  color: "#0f172a",
  margin: "0 0 16px",
};

const infoGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
};

const fieldStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  minWidth: 0,
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

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "15px",
};

const itemRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "minmax(180px, 2fr) minmax(110px, 1fr) minmax(130px, 1fr) auto",
  gap: "15px",
  padding: "18px",
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  marginBottom: "12px",
  alignItems: "start",
};

const stockTextStyle: CSSProperties = {
  color: "#64748b",
  fontSize: "12px",
};

const errorTextStyle: CSSProperties = {
  color: "#dc2626",
  fontSize: "12px",
};

const subtotalStyle: CSSProperties = {
  padding: "12px 0",
  color: "#0f172a",
  fontWeight: 700,
};

const removeButtonWrapper: CSSProperties = {
  paddingTop: "25px",
};

const addItemButton: CSSProperties = {
  padding: "10px 15px",
  backgroundColor: "#dbeafe",
  color: "#1d4ed8",
  border: "none",
  borderRadius: "8px",
  fontWeight: 600,
  cursor: "pointer",
};

const removeButton: CSSProperties = {
  padding: "11px 14px",
  backgroundColor: "#fee2e2",
  color: "#b91c1c",
  border: "none",
  borderRadius: "8px",
  fontWeight: 600,
  cursor: "pointer",
};

const totalBoxStyle: CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  padding: "22px",
  backgroundColor: "#eff6ff",
  border: "1px solid #bfdbfe",
  borderRadius: "10px",
};

const totalLabelStyle: CSSProperties = {
  color: "#64748b",
  margin: "0 0 6px",
  textAlign: "right",
};

const totalValueStyle: CSSProperties = {
  color: "#1d4ed8",
  fontSize: "28px",
  margin: 0,
  textAlign: "right",
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  gap: "12px",
  marginTop: "24px",
  flexWrap: "wrap",
};

const saveButtonStyle: CSSProperties = {
  padding: "12px 24px",
  backgroundColor: "#2563eb",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  fontWeight: 600,
  cursor: "pointer",
};

const clearButtonStyle: CSSProperties = {
  padding: "12px 24px",
  backgroundColor: "#e2e8f0",
  color: "#334155",
  border: "none",
  borderRadius: "8px",
  fontWeight: 600,
  cursor: "pointer",
};
