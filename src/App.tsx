
import { useState } from "react";

import DashboardPage from "./pages/DashBoardPage";
import CustomerPage from "./pages/CustomerPage";
import ItemPage from "./pages/ItemPage";
import OrderPage from "./pages/OrderPage";

function App() {
  const [currentPage, setCurrentPage] = useState<
    "dashboard" | "customer" | "item" | "order"
  >("dashboard");

  return (
    <div>
      <nav
        style={{
          padding: "20px",
          display: "flex",
          gap: "10px",
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
      </nav>

      {currentPage === "dashboard" && <DashboardPage />}
      {currentPage === "customer" && <CustomerPage />}
      {currentPage === "item" && <ItemPage />}
      {currentPage === "order" && <OrderPage />}
    </div>
  );
}

export default App;
