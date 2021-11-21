const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const { Rental } = require("../models/rental");
const {Movie} = require("../models/movie");
const {Customer} = require("../models/customer");

const router = express.Router();

Fawn.init(mongoose);
router.get("/", async (req, res) => {
  try {
    const rentals = await Rental.find().sort("-dateOut");
    res.send(rentals);
  } catch (error) {
    res.send(400).send(error.message);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      return res.status(404).send("Rental with given ID was not found");
    }
    res.send(rental);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
router.post("/", async (req, res) => {
  try {
    const result = validateRental(req.body);
    if (result.error) {
      return res.status(400).send(result.error.details[0].message);
    }

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) {
      return res.status(400).send("Invalid customer.");
    }
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) {
      return res.status(400).send("Invalid movie.");
    }
    if (movie.numberInStock === 0) {
      return res.status(400).send("Movie not in stock.");
    }
    let rental = new Rental({
      customer: customer,
      movie: movie,
    });
    // rental = await rental.save();
    // movie.numberInStock--;
    // movie.save();
    try {
      new Fawn.Task()
        .save("rentals", rental)
        .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
        .run();
      res.send(rental);
    } catch (error) {
      res.status(500).send("Something failed.");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// router.put("/:id", async (req, res) => {
//   try {
//     const result = validateRental(req.body);
//     if (result.error) {
//       return res.status(400).send(result.error.details[0].message);
//     }
//     const rental = await db.editRental(req.params.id, req.body);
//     if (!rental) {
//       return res.status(404).send("Rental with given ID was not found");
//     }

//     res.send(rental);
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// });

// router.delete("/:id", async (req, res) => {
//   try {
//     const rental = await db.removeRental(req.params.id);
//     if (!rental) {
//       return res.status(404).send("Rental with given ID was not found");
//     }

//     res.send(rental);
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// });

function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(rental);
}

module.exports = router;
