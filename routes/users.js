const express = require("express");
const Joi = require("joi");
const auth = require('../middleware/auth')

const bcrypt = require('bcrypt');
const { User } = require("../models/user");
const mongoose = require("mongoose");
const _ = require("lodash");
const passwordComplexity = require("joi-password-complexity");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort("name");
    res.send(users);
  } catch (error) {
    res.send(400).send(error.message);
  }
});
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send("User with given ID was not found");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
router.post("/", async (req, res) => {
  try {
    const result = validateUser(req.body);
    if (result.error) {
      return res.status(400).send(result.error.details[0].message);
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send("User already registered");
    }


    user = new User(_.pick(req.body, ["name", "email", "password"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken()
    res.header('x-auth-token', token).send(_.pick(user, ["_id", "name", "email"]))

  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const result = validateUser(req.body);
    if (result.error) {
      return res.status(400).send(result.error.details[0].message);
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).send("User with given ID was not found");
    }

    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) {
      return res.status(404).send("User with given ID was not found");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

function validateUser(user) {
  const complexityOptions = {
    min: 7,
    max: 30,
    // lowerCase: 1,
    // upperCase: 1,
    numeric: 1,
    // symbol: 1,
    requirementCount: 1,
  };
  const schema = Joi.object({
    name: Joi.string().required().min(3),
    email: Joi.string().email({
      minDomainSegments: 2,
    }),
    password: passwordComplexity(complexityOptions).required(),
  });

  return schema.validate(user);
}

module.exports = router;
