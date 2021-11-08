const mongoose = require("mongoose");

const rentalSchema = mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: { type: String, required: true },
      isGold: { type: Boolean, default: false },
      phone: { type: String, required: true },
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 250,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});
const Rental = mongoose.model("Rental", rentalSchema);
// async function getRentals() {
//   const rentals = await Rental.find().sort('-dateOut');
//   return rentals;
// }
// async function getRentalById(id) {
//   const rental = await Rental.findById(id);
//   return rental;
// }
// async function addRental(rentalInput) {
//   let rental = new Rental({
//     customer: rentalInput.customer,
//     movie: rentalInput.movie
//   });
//   rental = await rental.save();
//   return rental;
// }
// async function removeRental(id) {
//   const rental = await Rental.findByIdAndRemove(id);
//   return rental;
// }
// async function editRental(id, rentalChanged) {
//   const rental = await Rental.findByIdAndUpdate(
//     id,
//     {
//         customer: rentalChanged.customer,
//         movie: rentalChanged.movie
//     },
//     { new: true }
//   );
//   return rental;
// }

module.exports = {
  Rental
};
