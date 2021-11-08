const express = require("express");
const Joi = require("joi");
const db = require("../models/movie");
const dbGenre = require("../models/genre");
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
    const genre = await dbGenre.getGenreById(req.body.genreId);
    if (!genre) {
      return res.status(404).send("Genre with given ID was not found");
    }
    const movie = await db.addMovie(req.body, genre);
    return res.send(movie);
  } catch (error) {
    return res.send(400).send(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const result = validateMovie(req.body);
    if (result.error) {
      return res.status(400).send(result.error.details[0].message);
    }
    const genre = await dbGenre.getGenreById(req.body.genreId);
    if (!genre) {
      return res.status(404).send("Genre with given ID was not found");
    }
    const movie = await db.editMovie(req.params.id, req.body, genre);
    if (!movie) {
      return res.status(404).send("Movie with given ID was not found");
    }

    res.send(movie);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const movie = await db.removeMovie(req.params.id);
    if (!movie) {
      return res.status(404).send("Movie with given ID was not found");
    }

    res.send(movie);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().required().min(3),
    genreId: Joi.string().required().min(3),
    numberInStock: Joi.number().required().positive(),
    dailyRentalRate: Joi.number().required().positive(),
  });

  return schema.validate(movie);
}

module.exports = router;
