
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { deleteOrder, getOrders } from "../store/slices/orderSlice";
import AddOrderForm from "../components/order/AddOrderForm";

export default function OrderPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { orders, loading, error } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const handleDelete = async (orderId: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete order ${orderId}?`
    );

    if (!confirmed) return;

    try {
      await dispatch(deleteOrder(orderId)).unwrap();
      alert("Order deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete order.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <AddOrderForm />

      <hr style={{ margin: "30px 0" }} />

      <h2>Order Management</h2>

      {loading && <p>Loading orders...</p>}

      {error && <p>{error}</p>}

      {!loading && orders.length === 0 && (
        <p>No orders found.</p>
      )}

      {orders.length > 0 && (
        <table
          border={1}
          cellPadding={10}
          style={{
            borderCollapse: "collapse",
            width: "100%",
          }}
        >
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer ID</th>
              <th>Total (Rs.)</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.customerId}</td>
                <td>{Number(order.total).toFixed(2)}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleDelete(order.orderId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
