const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

const movieSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
    minlength: 3,
    maxlength: 250,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
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
async function addMovie(movieInput, genre) {
  let movie = new Movie({
    title: movieInput.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: movieInput.numberInStock,
    dailyRentalRate: movieInput.dailyRentalRate,
  });
  movie = await movie.save();
  return movie;
}
async function removeMovie(id) {
  const movie = await Movie.findByIdAndRemove(id);
  return movie;
}
async function editMovie(id, movieChanged, genre) {
  const movie = await Movie.findByIdAndUpdate(
    id,
    {
      title: movieChanged.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: movieChanged.numberInStock,
      dailyRentalRate: movieChanged.dailyRentalRate,
    },
    { new: true }
  );
  return movie;
}

module.exports = {
  getMovies,
  addMovie,
  removeMovie,
  editMovie,
  getMovieById
};
