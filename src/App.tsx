// import CustomerPage from "./pages/CustomerPage";

// function App() {
//   return <CustomerPage />;
// }

// export default App;





import { useState } from "react";
import CustomerPage from "./pages/CustomerPage";
import ItemPage from "./pages/ItemPage";

function App() {
  const [currentPage, setCurrentPage] = useState<"customer" | "item">(
    "customer"
  );

  return (
    <div>
      <nav style={{ padding: "20px", display: "flex", gap: "10px" }}>
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
      </nav>

      {currentPage === "customer" ? <CustomerPage /> : <ItemPage />}
    </div>
  );
}

export default App;
