
import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { addItem } from "../../store/slices/itemSlice";

function AddItemForm() {
  const dispatch = useDispatch<AppDispatch>();

  const [itemId, setItemId] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(
        addItem({
          itemId,
          itemName,
          quantity: Number(quantity),
          price: Number(price),
        })
      ).unwrap();

      alert("Item added successfully!");

      setItemId("");
      setItemName("");
      setQuantity("");
      setPrice("");
    } catch {
      alert("Failed to add item!");
    }
  };

  return (
    <div>
      <h2>Add New Item</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Item ID</label>
          <input
            type="text"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
          />
        </div>

        <div>
          <label>Item Name</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </div>

        <div>
          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div>
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <button type="submit">Add Item</button>
      </form>
    </div>
  );
}

export default AddItemForm;
