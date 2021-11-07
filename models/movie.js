const { required } = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

const movieSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStocks: {
    type: Number,
    required: true,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
  },
});
const Movie = mongoose.model("Movie", movieSchema);
async function getMovies() {
  const movies = await Movie.find().sort("title");
  return movies;
}
async function getMovieById(id) {
  const movie = await Movie.findById(id);
  return movie;
}
async function addMovie(name) {
  let movie = new Movie({
    name: name,
  });
  movie = await movie.save();
  return movie;
}
async function removeMovie(id) {
  const movie = await Movie.findByIdAndRemove(id);
  return movie;
}
async function editMovie(id, movieChanged) {
  const movie = await Movie.findByIdAndUpdate(id, movieChanged, { new: true });
  return movie;
}

module.exports = {
  getMovies,
  addMovie,
  removeMovie,
  editMovie,
  getMovieById,
};
