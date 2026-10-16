
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { AppDispatch, RootState } from "../../store/store";
// import {
//   addOrder,
//   addOrderItemDetails,
// } from "../../store/slices/orderSlice";
// import { getCustomers } from "../../store/slices/customerSlice";
// import { getItems } from "../../store/slices/itemSlice";

// export default function AddOrderForm() {
//   const dispatch = useDispatch<AppDispatch>();

//   const customers = useSelector(
//     (state: RootState) => state.customer.customers
//   );

//   const items = useSelector(
//     (state: RootState) => state.item.items
//   );

//   const [orderId, setOrderId] = useState("");
//   const [customerId, setCustomerId] = useState("");
//   const [itemId, setItemId] = useState("");
//   const [quantity, setQuantity] = useState(1);

//   useEffect(() => {
//     dispatch(getCustomers());
//     dispatch(getItems());
//   }, [dispatch]);

//   const selectedItem = items.find(
//     (item) => item.itemId === itemId
//   );

//   const total = selectedItem
//     ? selectedItem.price * quantity
//     : 0;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!customerId || !itemId || quantity <= 0) {
//       alert("Please select a customer, item and valid quantity.");
//       return;
//     }

//     try {
//       await dispatch(
//         addOrder({
//           orderId,
//           customerId,
//           total,
//         })
//       ).unwrap();

//       await dispatch(
//       addOrderItemDetails({
//         orderId,
//         itemId,
//         quantity,
//         })
//       ).unwrap();

//       alert("Order saved successfully!");

//       setOrderId("");
//       setCustomerId("");
//       setItemId("");
//       setQuantity(1);
//     } catch (error) {
//       console.error(error);
//       alert("Failed to save order.");
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         gap: "12px",
//         maxWidth: "350px",
//         padding: "20px",
//       }}
//     >
//       <h2>Add Order</h2>

//       <input
//         type="text"
//         placeholder="Order ID (e.g. O002)"
//         value={orderId}
//         onChange={(e) => setOrderId(e.target.value)}
//         required
//       />

//       <select
//         value={customerId}
//         onChange={(e) => setCustomerId(e.target.value)}
//         required
//       >
//         <option value="">Select Customer</option>

//         {customers.map((customer) => (
//           <option key={customer.id} value={customer.id}>
//             {customer.name} ({customer.id})
//           </option>
//         ))}
//       </select>

//       <select
//         value={itemId}
//         onChange={(e) => setItemId(e.target.value)}
//         required
//       >
//         <option value="">Select Item</option>

//         {items.map((item) => (
//           <option key={item.itemId} value={item.itemId}>
//             {item.itemName} - Rs. {item.price}
//           </option>
//         ))}
//       </select>

//       <input
//         type="number"
//         min="1"
//         value={quantity}
//         onChange={(e) => setQuantity(Number(e.target.value))}
//         required
//       />

//       <p>
//         Unit Price: Rs. {selectedItem?.price ?? 0}
//       </p>

//       <h3>Total: Rs. {total.toFixed(2)}</h3>

//       <button type="submit">Save Order</button>
//     </form>
//   );
// }



import { useEffect, useState } from "react";
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

  const grandTotal = orderLines.reduce((sum, line) => {
    const item = items.find(
      (currentItem) => currentItem.itemId === line.itemId
    );

    return sum + (item ? item.price * line.quantity : 0);
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderId.trim() || !customerId) {
      alert("Please enter an Order ID and select a customer.");
      return;
    }

    if (
      orderLines.some(
        (line) => !line.itemId || !Number.isInteger(line.quantity) || line.quantity < 1
      )
    ) {
      alert("Please select an item and enter a valid quantity for every row.");
      return;
    }

    const itemIds = orderLines.map((line) => line.itemId);

    if (new Set(itemIds).size !== itemIds.length) {
      alert("The same item is selected more than once. Please combine its quantity into one row.");
      return;
    }

    setSaving(true);

    try {
      await dispatch(
        addOrder({
          orderId,
          customerId,
          total: grandTotal,
        })
      ).unwrap();

      for (const line of orderLines) {
        await dispatch(
          addOrderItemDetails({
            orderId,
            itemId: line.itemId,
            quantity: line.quantity,
          })
        ).unwrap();
      }

      alert("Order and all items saved successfully!");

      setOrderId("");
      setCustomerId("");
      setOrderLines([{ itemId: "", quantity: 1 }]);
    } catch (error) {
      console.error("Order saving failed:", error);
      alert(
        "Saving failed. Check the console and backend. The order may have been created even if an item detail failed."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        maxWidth: "650px",
        padding: "20px",
      }}
    >
      <h2>Add Order</h2>

      <label>Order ID</label>
      <input
        type="text"
        placeholder="e.g. O003"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        required
      />

      <label>Customer</label>
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

      <h3>Order Items</h3>

      {orderLines.map((line, index) => {
        const selectedItem = items.find(
          (item) => item.itemId === line.itemId
        );

        const subtotal = selectedItem
          ? selectedItem.price * line.quantity
          : 0;

        return (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "12px",
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr auto",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <select
              value={line.itemId}
              onChange={(e) =>
                updateOrderLine(index, "itemId", e.target.value)
              }
              required
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

            <input
              type="number"
              min="1"
              step="1"
              aria-label={`Quantity for item ${index + 1}`}
              value={line.quantity}
              onChange={(e) =>
                updateOrderLine(
                  index,
                  "quantity",
                  Number(e.target.value)
                )
              }
              required
            />

            <span>Rs. {subtotal.toFixed(2)}</span>

            <button
              type="button"
              onClick={() => removeItem(index)}
              disabled={orderLines.length === 1}
            >
              Remove
            </button>
          </div>
        );
      })}

      <button type="button" onClick={addAnotherItem}>
        + Add Another Item
      </button>

      <h3>Grand Total: Rs. {grandTotal.toFixed(2)}</h3>

      <button type="submit" disabled={saving}>
        {saving ? "Saving Order..." : "Save Order"}
      </button>
    </form>
  );
}

