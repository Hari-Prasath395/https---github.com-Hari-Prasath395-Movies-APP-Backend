const express = require("express");
const router = express.Router();
const Movie = require("../models/movieModel");
const authMiddleware = require("../Middleware/authMiddleware");

// Route for adding a movie
router.post("/addMovie", authMiddleware, async (req, res) => {
  try {
    const {
      Title,
      Description,
      Duration,
      Language,
      Genre,
      ReleaseDate,
      PosterImageUrl,
    } = req.body;

    // Create a new movie instance
    const newMovie = new Movie({
      Title,
      Description,
      Duration,
      Language,
      Genre,
      ReleaseDate,
      PosterImageUrl,
    });

    // Save the movie to the database
    const savedMovie = await newMovie.save();

    res.status(200).json({
      success: true,
      message: "Movie Created Successfully",
      savedMovie,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/getAllMovies", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json({
      success: true,
      message: "Movies Fetched Successfully",
      data: movies,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

// PUT /api/movies/updateMovie/:id

router.put("/updateMovie/:id", authMiddleware, async (req, res) => {
    try {
      const movieId = req.params.id;
      const updatedMovieData = req.body;
  
      // Find the movie by ID
      const movie = await Movie.findById(movieId);
  
      if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
      }
  
      // Update the movie with the new data
      movie.set(updatedMovieData);
      const updatedMovie = await movie.save();
  
      res.json({
        success: true,
        message: "Movie updated successfully",
        movie: updatedMovie,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to update the movie",
      });
    }
  });
  
// DELETE /api/movies/deleteMovie/:id
router.delete('/deleteMovie/:id', async (req, res) => {
    try {
      const movieId = req.params.id;
  
      // Find the movie by ID and delete it
      const deletedMovie = await Movie.findByIdAndDelete(movieId);
  
      if (!deletedMovie) {
        return res.status(404).json({ error: 'Movie not found' });
      }
  
      res.json({ success: true, message: 'Movie deleted successfully' });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to delete the movie',
      });
    }
  });
  

  //get movie by id

  router.get('/movieId/:id', async (req, res) => {
    try {
      const movie = await Movie.findById(req.params.id);
      if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
      }
      res.status(200).json(movie);
    } catch (error) {
      console.error('Failed to fetch movie:', error);
      res.status(500).json({ error: 'Failed to fetch movie' });
    }
  });
  


module.exports = router;
