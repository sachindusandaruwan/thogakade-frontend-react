
import { useEffect, useState } from "react";
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

  const [selectedOrderId, setSelectedOrderId] =
    useState<string | null>(null);

  const [orderDetails, setOrderDetails] =
    useState<OrderItemDetails[]>([]);

  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    dispatch(getOrders());
    dispatch(getItems());
  }, [dispatch]);

  const handleViewDetails = async (orderId: string) => {
    setSelectedOrderId(orderId);
    setOrderDetails([]);
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
      alert("Failed to load order details.");
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
                    onClick={() => handleViewDetails(order.orderId)}
                  >
                    View Details
                  </button>{" "}

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

      {selectedOrderId && (
        <div style={{ marginTop: "30px" }}>
          <h2>Order Details — {selectedOrderId}</h2>

          {detailsLoading ? (
            <p>Loading order details...</p>
          ) : orderDetails.length === 0 ? (
            <p>No items found for this order.</p>
          ) : (
            <>
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
                    <th>Item ID</th>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Unit Price (Rs.)</th>
                    <th>Subtotal (Rs.)</th>
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
                        <td>{detail.itemId}</td>
                        <td>{item?.itemName ?? "Unknown Item"}</td>
                        <td>{detail.quantity}</td>
                        <td>
                          {Number(item?.price ?? 0).toFixed(2)}
                        </td>
                        <td>
                          {(
                            Number(item?.price ?? 0) *
                            detail.quantity
                          ).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <h3>
                Items Total: Rs. {detailsTotal.toFixed(2)}
              </h3>
            </>
          )}

          <button
            type="button"
            onClick={() => {
              setSelectedOrderId(null);
              setOrderDetails([]);
            }}
            style={{ marginTop: "12px" }}
          >
            Close Details
          </button>
        </div>
      )}
    </div>
  );
}
