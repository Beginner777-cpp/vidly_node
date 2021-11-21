
// const mongoose = require('mongoose');

// const objectId = new mongoose.Types.ObjectId('614b345e33a5b03b90130f80');
// console.log(objectId.getTimestamp());
// console.log(1);

// const bcrypt = require('bcrypt');

// async function run() {
//     const salt = await bcrypt.genSalt(10);
//     const hashed = await bcrypt.hash('1234', salt);
//     console.log(salt);
//     console.log(hashed);
// }

// run()

// let variable = function (object) {
//     object.property = 'characteristic';
// }

// // Use as decorator
// @variable
// class GFG {

// }
// console.log(GFG.property);


// function add(fn) {

//     return function(s) {

//       var gg = s + ' is Best';

//       // By concatenating we extend
//       // the function "add"
//       fn(gg);
//     }
//   }

// Decorated function
//   function print(s) {
//     console.log(s);
//   }

// Calling "add"
//   var g = add(print);

const Joi = require('joi');
Joi.objectId = require("joi-objectid")(Joi);
function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  console.log(schema.validate(rental));

  return schema.validate(rental);
}

validateRental({
  "customerId": "619a0caa2ded1e590a5687c9",
  "movieId": "619a0c5e2ded1e590a5687ba"
})