const mongoose = require("mongoose");

// mongoose.connect('mongodb://localhost/customer')
const customerSchema = mongoose.Schema({
  name: { type: String, required: true },
  isGold: { type: Boolean, default: false },
  phone: { type: String, required: true },
});

const Customer = mongoose.model("Customer", customerSchema);

async function getCustomers() {
  return await Customer.find().sort("name");
}
async function getCustomerById(id) {
  return await Customer.findById(id);
}
async function addCustomer(customerInput) {
  let customer = new Customer(customerInput);
  customer = await customer.save();
  return customer;
}
async function editCustomer(id, customerInput) {
  const customer = await Customer.findByIdAndUpdate(id, customerInput);
  return customer;
}
async function removeCustomer(id) {
  const customer = await Customer.findByIdAndRemove(id);
  return customer;
}

module.exports = {
  getCustomers,
  getCustomerById,
  addCustomer,
  editCustomer,
  removeCustomer,
};
