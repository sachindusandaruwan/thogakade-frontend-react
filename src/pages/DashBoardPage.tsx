
import { useEffect } from "react";
import type { CSSProperties } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../store/store";
import { getCustomers } from "../store/slices/customerSlice";
import { getItems } from "../store/slices/itemSlice";
import { getOrders } from "../store/slices/orderSlice";

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();

  const customers = useSelector(
    (state: RootState) => state.customer.customers
  );

  const items = useSelector(
    (state: RootState) => state.item.items
  );

  const orders = useSelector(
    (state: RootState) => state.order.orders
  );

  useEffect(() => {
    dispatch(getCustomers());
    dispatch(getItems());
    dispatch(getOrders());
  }, [dispatch]);

  const totalSales = orders.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );

  const totalStock = items.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );

  const inventoryValue = items.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  const lowStockItems = items.filter(
    (item) => Number(item.quantity) <= 5
  );

  const recentOrders = [...orders].reverse().slice(0, 5);

  const dashboardCards = [
    {
      title: "Total Customers",
      value: customers.length,
      icon: "👥",
      color: "#2563eb",
      background: "#eff6ff",
    },
    {
      title: "Total Items",
      value: items.length,
      icon: "📦",
      color: "#7c3aed",
      background: "#f5f3ff",
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: "🛒",
      color: "#ea580c",
      background: "#fff7ed",
    },
    {
      title: "Total Sales",
      value: `Rs. ${totalSales.toFixed(2)}`,
      icon: "💰",
      color: "#16a34a",
      background: "#f0fdf4",
    },
  ];

  return (
    <div style={pageStyle}>
      <div style={pageHeader}>
        <div>
          <h1 style={pageTitle}>POS Dashboard</h1>
          <p style={pageSubtitle}>
            Welcome to Thogakade POS System
          </p>
        </div>

        <span style={systemBadge}>System Overview</span>
      </div>

      {lowStockItems.length > 0 && (
  <div
    style={{
      backgroundColor: "#fff7ed",
      border: "1px solid #fdba74",
      borderLeft: "5px solid #f97316",
      padding: "18px 22px",
      borderRadius: "10px",
      marginBottom: "25px",
      color: "#9a3412",
    }}
  >
    <h3 style={{ margin: "0 0 8px", color: "#9a3412" }}>
      ⚠️ Low Stock Warning!
    </h3>

    <p style={{ margin: 0, color: "#9a3412" }}>
      {lowStockItems.length} item(s) have fewer than
      5 units remaining. Please restock soon.
    </p>
  </div>
)}

      <div style={statsGrid}>
        {dashboardCards.map((card) => (
          <div key={card.title} style={statCard}>
            <div style={cardHeader}>
              <span style={cardLabel}>{card.title}</span>

              <div
                style={{
                  ...iconBox,
                  backgroundColor: card.background,
                  color: card.color,
                }}
              >
                {card.icon}
              </div>
            </div>

            <h2 style={cardValue}>{card.value}</h2>
          </div>
        ))}
      </div>

      <div style={sectionGrid}>
        <div style={panelStyle}>
          <div style={sectionHeader}>
            <div>
              <h2 style={sectionTitle}>Inventory Overview</h2>
              <p style={sectionSubtitle}>
                Current inventory information
              </p>
            </div>
          </div>

          <div style={inventoryGrid}>
            <div style={inventoryBox}>
              <p style={inventoryLabel}>Total Stock Units</p>
              <h3 style={inventoryNumber}>{totalStock}</h3>
            </div>

            <div style={inventoryBox}>
              <p style={inventoryLabel}>Inventory Value</p>
              <h3 style={inventoryNumber}>
                Rs. {inventoryValue.toFixed(2)}
              </h3>
            </div>
          </div>
        </div>

        <div style={panelStyle}>
          <div style={sectionHeader}>
            <div>
              <h2 style={sectionTitle}>Stock Alerts</h2>
              <p style={sectionSubtitle}>
                Items with quantity 5 or less
              </p>
            </div>
          </div>

          {lowStockItems.length === 0 ? (
            <p style={successText}>
              All items have sufficient stock.
            </p>
          ) : (
            <div style={alertList}>
              {lowStockItems.map((item) => (
                <div key={item.itemId} style={alertRow}>
                  <div>
                    <strong style={{ color: "#0f172a" }}>
                      {item.itemName}
                    </strong>
                    <p style={alertItemId}>{item.itemId}</p>
                  </div>

                  <span style={stockBadge}>
                    {item.quantity === 0
                      ? "Out of Stock"
                      : `${item.quantity} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={panelStyle}>
        <div style={sectionHeader}>
          <div>
            <h2 style={sectionTitle}>Recent Orders</h2>
            <p style={sectionSubtitle}>
              Latest 5 orders in the system
            </p>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Order ID</th>
                <th style={thStyle}>Customer ID</th>
                <th style={thStyle}>Total (Rs.)</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.orderId}>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>
                    {order.orderId}
                  </td>
                  <td style={tdStyle}>{order.customerId}</td>
                  <td style={tdStyle}>
                    Rs. {Number(order.total).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {recentOrders.length === 0 && (
            <p style={emptyStyle}>No orders available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

const pageStyle: CSSProperties = {
  padding: "30px",
  backgroundColor: "#f3f6fb",
  minHeight: "100vh",
  color: "#334155",
};

const pageHeader: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "15px",
  marginBottom: "28px",
};

const pageTitle: CSSProperties = {
  margin: 0,
  color: "#0f172a",
  fontSize: "30px",
  fontWeight: 700,
};

const pageSubtitle: CSSProperties = {
  marginTop: "8px",
  color: "#64748b",
  fontSize: "15px",
};

const systemBadge: CSSProperties = {
  padding: "9px 14px",
  borderRadius: "20px",
  backgroundColor: "#dbeafe",
  color: "#1d4ed8",
  fontWeight: 600,
  fontSize: "13px",
};

const statsGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginBottom: "25px",
};

const statCard: CSSProperties = {
  backgroundColor: "#ffffff",
  padding: "24px",
  borderRadius: "14px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
};

const cardHeader: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
};

const cardLabel: CSSProperties = {
  color: "#64748b",
  fontSize: "14px",
  fontWeight: 600,
};

const iconBox: CSSProperties = {
  width: "44px",
  height: "44px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "22px",
};

const cardValue: CSSProperties = {
  color: "#0f172a",
  fontSize: "28px",
  fontWeight: 700,
  margin: "18px 0 0",
  overflowWrap: "anywhere",
};

const sectionGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "20px",
  marginBottom: "25px",
};

const panelStyle: CSSProperties = {
  backgroundColor: "#ffffff",
  padding: "24px",
  borderRadius: "14px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  minWidth: 0,
};

const sectionHeader: CSSProperties = {
  marginBottom: "20px",
};

const sectionTitle: CSSProperties = {
  color: "#0f172a",
  fontSize: "19px",
  margin: 0,
};

const sectionSubtitle: CSSProperties = {
  color: "#64748b",
  fontSize: "13px",
  margin: "6px 0 0",
};

const inventoryGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "15px",
};

const inventoryBox: CSSProperties = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  padding: "20px",
};

const inventoryLabel: CSSProperties = {
  color: "#64748b",
  fontSize: "13px",
  margin: 0,
};

const inventoryNumber: CSSProperties = {
  color: "#0f172a",
  fontSize: "22px",
  margin: "12px 0 0",
  overflowWrap: "anywhere",
};

const alertList: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const alertRow: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  padding: "12px",
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
};

const alertItemId: CSSProperties = {
  margin: "4px 0 0",
  color: "#64748b",
  fontSize: "12px",
};

const stockBadge: CSSProperties = {
  backgroundColor: "#fef3c7",
  color: "#92400e",
  borderRadius: "20px",
  padding: "6px 10px",
  fontSize: "12px",
  fontWeight: 600,
  whiteSpace: "nowrap",
};

const successText: CSSProperties = {
  color: "#15803d",
  fontWeight: 600,
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

const emptyStyle: CSSProperties = {
  textAlign: "center",
  color: "#64748b",
  padding: "20px",
};
