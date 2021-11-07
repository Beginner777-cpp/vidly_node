const express = require("express");
const Joi = require("joi");
const db = require("../models/movie");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const movies = await db.getMovies();
    res.send(movies);
  } catch (error) {
    res.send(400).send(error.message);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const movie = await db.getMovieById(req.params.id);
    if (!movie) {
      return res.status(404).send("Movie with given ID was not found");
    }
    res.send(movie);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
router.post("/", async (req, res) => {
  try {
    const result = validateMovie(req.body);
    if (result.error) {
      return res.status(400).send(result.error.details[0].message);
    }
    const genre = await db.addGenre(req.body.name);
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
    const genre = await db.editGenre(req.params.id, req.body.name);
    if (!genre) {
      return res.status(404).send("Genre with given ID was not found");
    }

    res.send(genre);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const genre = await db.removeGenre(req.params.id);
    if (!genre) {
      return res.status(404).send("Genre with given ID was not found");
    }

    res.send(genre);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().required().min(3),

  });
  return schema.validate(movie);
}

module.exports = router;
