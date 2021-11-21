const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");
const { Genre } = require("../models/genre");
const auth = require('../middleware/auth')
const admin = require('../middleware/admin');
const router = express.Router();

router.get("/", async (req, res) => {
  // throw new Error('Could not get the genres.');
  const genres = await Genre.find().sort("name");
  res.send(genres);
});
router.get("/:id", async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) {
      return res.status(404).send("Genre with given ID was not found");
    }
    res.send(genre);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
router.post("/", auth, async (req, res) => {
  try {
    const result = validateGenre(req.body);
    if (result.error) {
      return res.status(400).send(result.error.details[0].message);
    }
    const genre = new Genre({
      name: req.body.name,
    });
    await genre.save();
    res.send(genre);
  } catch (error) {
    res.send(400).send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const result = validateGenre(req.body);
    if (result.error) {
      return res.status(400).send(result.error.details[0].message);
    }
    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
      },
      { new: true }
    );
    if (!genre) {
      return res.status(404).send("Genre with given ID was not found");
    }

    res.send(genre);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) {
      return res.status(404).send("Genre with given ID was not found");
    }
    res.send(genre);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().required().min(3),
  });
  return schema.validate(genre);
}

module.exports = router;
