
import { useState } from "react";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashBoardPage";
import CustomerPage from "./pages/CustomerPage";
import ItemPage from "./pages/ItemPage";
import OrderPage from "./pages/OrderPage";

type Page = "dashboard" | "customer" | "item" | "order";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("dashboard");
  };

  if (!isLoggedIn) {
    return (
      <LoginPage
        onLoginSuccess={() => setIsLoggedIn(true)}
      />
    );
  }

  return (
    <div>
      <nav
        style={{
          padding: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          alignItems: "center",
          backgroundColor: "#1e293b",
        }}
      >
        <button
          type="button"
          onClick={() => setCurrentPage("dashboard")}
        >
          Dashboard
        </button>

        <button
          type="button"
          onClick={() => setCurrentPage("customer")}
        >
          Customer Management
        </button>

        <button
          type="button"
          onClick={() => setCurrentPage("item")}
        >
          Item Management
        </button>

        <button
          type="button"
          onClick={() => setCurrentPage("order")}
        >
          Order Management
        </button>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            marginLeft: "auto",
            backgroundColor: "#dc2626",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </nav>

      {currentPage === "dashboard" && <DashboardPage />}
      {currentPage === "customer" && <CustomerPage />}
      {currentPage === "item" && <ItemPage />}
      {currentPage === "order" && <OrderPage />}
    </div>
  );
}

export default App;
