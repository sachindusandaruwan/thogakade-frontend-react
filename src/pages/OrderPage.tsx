
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import type { AppDispatch, RootState } from "../store/store";
import {
  deleteOrder,
  getOrders,
} from "../store/slices/orderSlice";
import type { OrderItemDetails } from "../store/slices/orderSlice";

import { getItems } from "../store/slices/itemSlice";
import AddOrderForm from "../components/order/AddOrderForm";

export default function OrderPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { orders, loading, error } = useSelector(
    (state: RootState) => state.order
  );

  const items = useSelector(
    (state: RootState) => state.item.items
  );

  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const [selectedOrderId, setSelectedOrderId] =
    useState<string | null>(null);

  const [orderDetails, setOrderDetails] =
    useState<OrderItemDetails[]>([]);

  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  useEffect(() => {
    dispatch(getOrders());
    dispatch(getItems());
  }, [dispatch]);

  const totalSales = orders.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );

  const filteredOrders = orders.filter((order) => {
    const query = search.toLowerCase();

    return (
      order.orderId.toLowerCase().includes(query) ||
      order.customerId.toLowerCase().includes(query)
    );
  });

  const handleViewDetails = async (orderId: string) => {
    setSelectedOrderId(orderId);
    setOrderDetails([]);
    setDetailsError("");
    setDetailsLoading(true);

    try {
      const response = await axios.get<OrderItemDetails[]>(
        "http://localhost:8080/api/order-items"
      );

      const details = response.data.filter(
        (detail) => detail.orderId === orderId
      );

      setOrderDetails(details);
    } catch (error) {
      console.error("Failed to load order details:", error);
      setDetailsError("Failed to load order details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleDelete = async (orderId: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete order ${orderId}?`
    );

    if (!confirmed) return;

    try {
      await dispatch(deleteOrder(orderId)).unwrap();

      if (selectedOrderId === orderId) {
        setSelectedOrderId(null);
        setOrderDetails([]);
      }

      alert("Order deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete order.");
    }
  };

  const detailsTotal = orderDetails.reduce((sum, detail) => {
    const item = items.find(
      (currentItem) => currentItem.itemId === detail.itemId
    );

    return sum + Number(item?.price ?? 0) * detail.quantity;
  }, 0);

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={{ margin: 0, color: "#0f172a" }}>
            Order Management
          </h1>
          <p style={{ color: "#64748b" }}>
            Manage orders and view sales information
          </p>
        </div>

        <button
          type="button"
          style={primaryButton}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Close Form" : "+ Add Order"}
        </button>
      </div>

      <div style={statsGrid}>
        <div style={statCard}>
          <p style={statLabel}>Total Orders</p>
          <h2 style={statValue}>{orders.length}</h2>
        </div>

        <div style={statCard}>
          <p style={statLabel}>Total Sales</p>
          <h2 style={statValue}>
            Rs. {totalSales.toFixed(2)}
          </h2>
        </div>
      </div>

      {showAddForm && (
        <div style={panelStyle}>
          <AddOrderForm />
        </div>
      )}

      <div style={panelStyle}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0, color: "#0f172a" }}>
            Order List
          </h2>

          <input
            type="text"
            placeholder="Search Order ID or Customer ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchStyle}
          />
        </div>

        {loading && <p>Loading orders...</p>}

        {error && (
          <p style={{ color: "#dc2626" }}>{error}</p>
        )}

        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Order ID</th>
                <th style={thStyle}>Customer ID</th>
                <th style={thStyle}>Total (Rs.)</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.orderId}>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>
                    {order.orderId}
                  </td>
                  <td style={tdStyle}>{order.customerId}</td>
                  <td style={tdStyle}>
                    {Number(order.total).toFixed(2)}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        type="button"
                        style={viewButton}
                        onClick={() =>
                          handleViewDetails(order.orderId)
                        }
                      >
                        View Details
                      </button>

                      <button
                        type="button"
                        style={deleteButton}
                        onClick={() =>
                          handleDelete(order.orderId)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && filteredOrders.length === 0 && (
            <p style={emptyStyle}>No orders found.</p>
          )}
        </div>
      </div>

      {selectedOrderId && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div style={headerStyle}>
              <div>
                <h2 style={{ margin: 0, color: "#0f172a" }}>
                  Order Details
                </h2>
                <p style={{ color: "#64748b" }}>
                  Order ID: {selectedOrderId}
                </p>
              </div>

              <button
                type="button"
                style={secondaryButton}
                onClick={() => {
                  setSelectedOrderId(null);
                  setOrderDetails([]);
                }}
              >
                Close
              </button>
            </div>

            {detailsLoading ? (
              <p>Loading order details...</p>
            ) : detailsError ? (
              <p style={{ color: "#dc2626" }}>
                {detailsError}
              </p>
            ) : orderDetails.length === 0 ? (
              <p>No items found for this order.</p>
            ) : (
              <>
                <div style={{ overflowX: "auto" }}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Item ID</th>
                        <th style={thStyle}>Item Name</th>
                        <th style={thStyle}>Quantity</th>
                        <th style={thStyle}>Unit Price</th>
                        <th style={thStyle}>Subtotal</th>
                      </tr>
                    </thead>

                    <tbody>
                      {orderDetails.map((detail, index) => {
                        const item = items.find(
                          (currentItem) =>
                            currentItem.itemId === detail.itemId
                        );

                        return (
                          <tr key={`${detail.itemId}-${index}`}>
                            <td style={tdStyle}>{detail.itemId}</td>
                            <td style={tdStyle}>
                              {item?.itemName ?? "Unknown Item"}
                            </td>
                            <td style={tdStyle}>{detail.quantity}</td>
                            <td style={tdStyle}>
                              Rs. {Number(item?.price ?? 0).toFixed(2)}
                            </td>
                            <td style={tdStyle}>
                              Rs. {(
                                Number(item?.price ?? 0) *
                                detail.quantity
                              ).toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div style={totalBoxStyle}>
                  <strong>
                    Items Total: Rs. {detailsTotal.toFixed(2)}
                  </strong>
                </div>
              </>
            )}
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

const deleteButton: CSSProperties = {
  ...buttonBase,
  backgroundColor: "#fee2e2",
  color: "#b91c1c",
};

const searchStyle: CSSProperties = {
  padding: "11px 14px",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  width: "280px",
  backgroundColor: "#fff",
  color: "#0f172a",
};

const emptyStyle: CSSProperties = {
  textAlign: "center",
  color: "#64748b",
  padding: "20px",
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
  maxWidth: "850px",
  maxHeight: "85vh",
  overflowY: "auto",
  boxSizing: "border-box",
  color: "#334155",
};

const totalBoxStyle: CSSProperties = {
  marginTop: "20px",
  padding: "16px",
  backgroundColor: "#eff6ff",
  borderRadius: "8px",
  color: "#1d4ed8",
  textAlign: "right",
  fontSize: "18px",
};
