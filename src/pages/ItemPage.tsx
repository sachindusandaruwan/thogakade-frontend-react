
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { getItems,updateItem,deleteItem } from "../store/slices/itemSlice";
import AddItemForm from "../components/item/AddItemForm";
import type { Item } from "../types/item";


function ItemPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [viewItem, setViewItem] = useState<Item | null>(null);
  const [editItem, setEditItem] = useState<Item | null>(null);

  const { items, loading, error } = useSelector(
    (state: RootState) => state.item
  );

  useEffect(() => {
    dispatch(getItems());
  }, [dispatch]);

  
const handleDelete = async (itemId: string) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this item?"
  );

  if (!confirmed) return;

  try {
    await dispatch(deleteItem(itemId)).unwrap();

    if (viewItem?.itemId === itemId) {
      setViewItem(null);
    }

    if (editItem?.itemId === itemId) {
      setEditItem(null);
    }

    alert("Item deleted successfully!");
  } catch {
    alert("Failed to delete item.");
  }
};


  return (
    <div style={{ padding: "20px" }}>
      <h1>Item Management</h1>

      <AddItemForm />

      <h2>Item List</h2>

      {loading && <p>Loading items...</p>}
      {error && <p>{error}</p>}

      {!loading && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          
        <thead>
        <tr>
            <th style={cellStyle}>Item ID</th>
            <th style={cellStyle}>Item Name</th>
            <th style={cellStyle}>Quantity</th>
            <th style={cellStyle}>Price</th>
            <th style={cellStyle}>Action</th>
        </tr>
        </thead>


          
        <tbody>
        {items.map((item) => (
            <tr key={item.itemId}>
            <td style={cellStyle}>{item.itemId}</td>
            <td style={cellStyle}>{item.itemName}</td>
            <td style={cellStyle}>{item.quantity}</td>
            <td style={cellStyle}>{item.price}</td>
            <td style={cellStyle}>
                <div style={{ display: "flex", gap: "8px" }}>
                <button
                type="button"
                onClick={() => setViewItem(item)}
                >
                View
                </button>
                
                <button
                type="button"
                onClick={() => setEditItem({ ...item })}
                >
                Edit
                </button>
                
                <button
                type="button"
                onClick={() => handleDelete(item.itemId)}
                >
                Delete
                </button>

                </div>
            </td>
            </tr>
        ))}
        </tbody>

        </table>
      )}
      
        {viewItem && (
        <div style={{ border: "1px solid #ccc", padding: "20px", marginTop: "20px" }}>
            <h2>Item Details</h2>

            <p><strong>Item ID:</strong> {viewItem.itemId}</p>
            <p><strong>Item Name:</strong> {viewItem.itemName}</p>
            <p><strong>Quantity:</strong> {viewItem.quantity}</p>
            <p><strong>Price:</strong> {viewItem.price}</p>

            <button type="button" onClick={() => setViewItem(null)}>
            Close
            </button>
        </div>
        )}

        {editItem && (
        <div style={{ border: "1px solid #ccc", padding: "20px", marginTop: "20px" }}>
            <h2>Edit Item</h2>

            <form
            onSubmit={async (e) => {
                e.preventDefault();

                try {
                await dispatch(updateItem(editItem)).unwrap();
                setEditItem(null);
                alert("Item updated successfully!");
                } catch {
                alert("Failed to update item!");
                }
            }}
            >
            <div>
                <label>Item ID</label>
                <input value={editItem.itemId} disabled />
            </div>

            <div>
                <label>Item Name</label>
                <input
                value={editItem.itemName}
                onChange={(e) =>
                    setEditItem({ ...editItem, itemName: e.target.value })
                }
                />
            </div>

            <div>
                <label>Quantity</label>
                <input
                type="number"
                value={editItem.quantity}
                onChange={(e) =>
                    setEditItem({ ...editItem, quantity: Number(e.target.value) })
                }
                />
            </div>

            <div>
                <label>Price</label>
                <input
                type="number"
                value={editItem.price}
                onChange={(e) =>
                    setEditItem({ ...editItem, price: Number(e.target.value) })
                }
                />
            </div>

            <button type="submit">Update Item</button>
            <button type="button" onClick={() => setEditItem(null)}>
                Cancel
            </button>
            </form>
        </div>
        )}


    </div>
  );
}

const cellStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "10px",
  textAlign: "left",
};

export default ItemPage;
