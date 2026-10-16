
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import {
  addOrder,
  addOrderItemDetails,
} from "../../store/slices/orderSlice";
import { getCustomers } from "../../store/slices/customerSlice";
import { getItems } from "../../store/slices/itemSlice";

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
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(getCustomers());
    dispatch(getItems());
  }, [dispatch]);

  const selectedItem = items.find(
    (item) => item.itemId === itemId
  );

  const total = selectedItem
    ? selectedItem.price * quantity
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerId || !itemId || quantity <= 0) {
      alert("Please select a customer, item and valid quantity.");
      return;
    }

    try {
      await dispatch(
        addOrder({
          orderId,
          customerId,
          total,
        })
      ).unwrap();

      await dispatch(
      addOrderItemDetails({
        orderId,
        itemId,
        quantity,
        })
      ).unwrap();

      alert("Order saved successfully!");

      setOrderId("");
      setCustomerId("");
      setItemId("");
      setQuantity(1);
    } catch (error) {
      console.error(error);
      alert("Failed to save order.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        maxWidth: "350px",
        padding: "20px",
      }}
    >
      <h2>Add Order</h2>

      <input
        type="text"
        placeholder="Order ID (e.g. O002)"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        required
      />

      <select
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        required
      >
        <option value="">Select Customer</option>

        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.name} ({customer.id})
          </option>
        ))}
      </select>

      <select
        value={itemId}
        onChange={(e) => setItemId(e.target.value)}
        required
      >
        <option value="">Select Item</option>

        {items.map((item) => (
          <option key={item.itemId} value={item.itemId}>
            {item.itemName} - Rs. {item.price}
          </option>
        ))}
      </select>

      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        required
      />

      <p>
        Unit Price: Rs. {selectedItem?.price ?? 0}
      </p>

      <h3>Total: Rs. {total.toFixed(2)}</h3>

      <button type="submit">Save Order</button>
    </form>
  );
}
