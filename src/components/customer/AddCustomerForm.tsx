function AddCustomerForm() {
  return (
    <div>
      <h2>Add Customer</h2>

      <form>
        <div>
          <label>ID</label>
          <input type="text" />
        </div>

        <div>
          <label>Name</label>
          <input type="text" />
        </div>

        <div>
          <label>Address</label>
          <input type="text" />
        </div>

        <div>
          <label>Phone</label>
          <input type="text" />
        </div>

        <button type="submit">Add Customer</button>
      </form>
    </div>
  );
}

export default AddCustomerForm;