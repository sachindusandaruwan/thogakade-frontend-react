import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { addCustomer } from "../../store/slices/customerSlice";

function AddCustomerForm() {

  const dispatch = useDispatch<AppDispatch>();

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const customer = {
      id,
      name,
      address,
      phone
    };

    dispatch(addCustomer(customer));
  };

  return (
    <div>
      <h2>Add Customer</h2>

      <form onSubmit={handleSubmit}>

        <div>
          <label>ID</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>

        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label>Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div>
          <label>Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <button type="submit">
          Add Customer
        </button>

      </form>
    </div>
  );
}

export default AddCustomerForm;