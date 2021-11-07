const express = require("express");
const Joi = require("joi");
const router = express.Router();
const db = require("../models/customerDb");
router.get("/", async (req, res) => {
  try {
    const customers = await db.getCustomers();
    res.send(customers);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const customer = await db.getCustomerById(req.params.id);
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
    const customer = await db.addCustomer(req.body);
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
    const customer = await db.editCustomer(req.params.id, req.body);
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
    const customer = await db.removeCustomer(req.params.id);
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
