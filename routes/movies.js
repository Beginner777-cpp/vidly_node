const express = require("express");
const Joi = require("joi");
const { Movie } = require("../models/movie");
const { Genre } = require("../models/genre");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().sort("title");
    res.send(movies);
  } catch (error) {
    res.send(400).send(error.message);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
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
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) {
      return res.status(404).send("Genre with given ID was not found");
    }
    const movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    });
    await movie.save();
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
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) {
      return res.status(404).send("Genre with given ID was not found");
    }
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
      },
      { new: true }
    );
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
    const movie = await Movie.findByIdAndRemove(req.params.id);
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
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().required().positive(),
    dailyRentalRate: Joi.number().required().positive(),
  });

  return schema.validate(movie);
}

module.exports = router;
