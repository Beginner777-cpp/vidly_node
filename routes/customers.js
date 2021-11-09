const express = require("express");
const Joi = require("joi");
const router = express.Router();
const { Customer } = require("../models/customer");
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find().sort("name");
    res.send(customers);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      res.status(404).send("Customer with given ID was not found");
    }
    res.send(customer);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
router.post("/", async (req, res) => {
  try {
    const result = validateCustomer(req.body);
    if (!result) {
      return res.status(400).send(result.error.details[0].message);
    }
    const customer = new Customer(req.body);
    await customer.save();
    res.send(customer);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
router.put("/:id", async (req, res) => {
  try {
    const result = validateCustomer(req.body);
    if (!result) {
      return res.status(400).send(result.error.details[0].message);
    }
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body);
    if (!customer) {
      return res.status(404).send("Сustomer with given ID was not found");
    }
    res.send(customer);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) {
      return res.status(404).send("Сustomer with given ID was not found");
    }
    res.send(customer);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().required().min(3),
    isGold: Joi.boolean().required(),
    phone: Joi.string().required().min(3),
  });
  return schema.validate(customer);
}

module.exports = router;
