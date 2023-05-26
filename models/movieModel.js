const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    Duration: { type: Number, required: true },
    Language: { type: String , required: true},
    Genre: { type: String, required: true },
    ReleaseDate: { type: Date , required: true},
    PosterImageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
