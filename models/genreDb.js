const mongoose = require("mongoose");


const genreSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});
const Genre = mongoose.model("Genre", genreSchema);
async function getGenres() {
  const genres = await Genre.find().sort("name");
  return genres;
}
async function getGenreById(id) {
  const genre = await Genre.findById(id);
  return genre;
}
async function addGenre(name) {
  let genre = new Genre({
    name: name,
  });
  genre = await genre.save();
  return genre;
}
async function removeGenre(id) {
  const genre = await Genre.findByIdAndRemove(id);
  return genre;
}
async function editGenre(id, name) {
  const genre = await Genre.findByIdAndUpdate(
    id,
    {
      name: name,
    },
    { new: true }
  );
  return genre;
}

module.exports = {
  getGenres,
  addGenre,
  removeGenre,
  editGenre,
  getGenreById,
};
