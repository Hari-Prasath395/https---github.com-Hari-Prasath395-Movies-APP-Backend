const express = require("express");
const router = express.Router();
const Theater = require("../models/theaterModel");
const Show = require("../models/showsModel");
const mongoose = require("mongoose");

// Add theater
router.post("/addTheater", async (req, res) => {
    try {
      const { name, address, phone, email, owner } = req.body;
  
      const theater = new Theater({
        name,
        address,
        phone,
        email,
        owner,
      });
  
      const savedTheater = await theater.save();
      res.status(201).json({
        success:true,
        message: "Theater added successfully",
        data: savedTheater,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to add theater",
        error: error.message,
      });
    }
  });

  
// Get all theaters
router.get("/getTheaters", async (req, res) => {
    try {
      // Retrieve all theaters from the database
      const theaters = await Theater.find();
  
      res.json({ success: true,message:"Theaters fetched successfully", data:theaters });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to retrieve theaters",
      });
    }
  });

  router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { name, address, phone, email } = req.body;
  
    try {
      const theater = await Theater.findByIdAndUpdate(
        id,
        { name, address, phone, email },
        { new: true }
      );
  
      if (!theater) {
        return res.status(404).json({ error: 'Theater not found' });
      }
  
      res.json({ message: 'Theater updated successfully', theater });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

  router.delete('/deleteTheater/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const theater = await Theater.findByIdAndDelete(id);
  
      if (!theater) {
        return res.status(404).json({ error: 'Theater not found' });
      }
  
      res.json({ message: 'Theater deleted successfully', theater });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });


// PUT route to update theater status
router.put('/updateStatus/:theaterId', async (req, res) => {
    const { theaterId } = req.params;
    const { status } = req.body;
  
    try {
      // Find the theater by ID
      const theater = await Theater.findById(theaterId);
  
      if (!theater) {
        return res.status(404).json({ success: false, message: 'Theater not found' });
      }
  
      // Update the theater status
      theater.status = status;
  
      // Save the updated theater
      await theater.save();
  
      res.json({ success: true, message: 'Theater status updated successfully' });
    } catch (error) {
      console.error('Failed to update theater status:', error);
      res.status(500).json({ success: false, message: 'Failed to update theater status' });
    }
  });

// Add Show
router.post('/addShow', async (req, res) => {
  try {
    // Extract data from the request body
    const {
      showName,
      date,
      time,
      movie,
      ticketPrice,
      totalSeats,
      availableSeats,
      theater,
      bookedSeats,
    } = req.body;

    // Create a new show document
    const newShow = new Show({
      showName,
      date,
      time,
      movie,
      ticketPrice,
      totalSeats,
      availableSeats,
      theater,
      bookedSeats,
    });

    // Save the new show
    const savedShow = await newShow.save();
    res.status(200).json(savedShow);
  } catch (error) {
    console.error('Failed to add show:', error);
    res.status(500).json({ error: 'Failed to add show' });
  }
});


// Get All Shows by Theater ID
router.get('/getShowsByTheater/:theaterId', async (req, res) => {
  try {
    const theaterId = req.params.theaterId;
    const shows = await Show.find({ theater: theaterId }).populate('movie theater');
    res.status(200).json({ data: shows });
  } catch (error) {
    console.error('Failed to get shows by theater ID:', error);
    res.status(500).json({ error: 'Failed to get shows by theater ID' });
  }
});


router.delete('/deleteShow/:showId', async (req, res) => {
  try {
    const showId = req.params.showId;

    // Find the show to delete by its ID and delete it
    const deletedShow = await Show.findByIdAndDelete(showId);

    if (!deletedShow) {
      return res.status(404).json({ error: 'Show not found' });
    }

    res.json({ message: 'Show deleted successfully' });
  } catch (error) {
    console.error('Failed to delete show:', error);
    res.status(500).json({ error: 'Failed to delete show' });
  }
});

//get all theaters which have shows of a movie

// router.post('/getAllTheatersByMovie', async (req, res) => {
//   try {
//     const { movie, date } = req.body;

//     // Find all shows of a movie
//     const shows = await Show.find({ movie, date }).populate('theater');

//     // Get all unique theaters
//     const uniqueTheaters = [];
//     shows.forEach((show) => {
//       const theater = uniqueTheaters.find((theater) => theater._id.toString() === show.theater._id.toString());
//       if (!theater) {
//         const showsForThisTheater = shows.filter((showobj) => showobj.theater._id.toString() === show.theater._id.toString());
//         uniqueTheaters.push(show.theater);
//       }
//     });

//     res.status(200).json({
//       success: true,
//       message: "Theaters fetched successfully",
//       data: uniqueTheaters
//     });
//   } catch (error) {
//     console.error('Failed to fetch theaters:', error);
//     res.status(500).json({ success: false, error: 'Failed to fetch theaters' });
//   }
// });

router.post('/getAllTheatersByMovie', async (req, res) => {
  try {
    const { movie, date } = req.body;

    // Find all shows of a movie
    const shows = await Show.find({ movie, date }).populate('theater');

    // Get all unique theaters
    const uniqueTheaters = [];
    shows.forEach((show) => {
      const theater = uniqueTheaters.find((theater) => theater._id.toString() === show.theater._id.toString());
      if (!theater) {
        const showsForThisTheater = shows.filter((showobj) => showobj.theater._id.toString() === show.theater._id.toString());
        uniqueTheaters.push(show.theater);
      }
    });

    res.status(200).json({
      success: true,
      message: "Theaters fetched successfully",
      data: uniqueTheaters.map((theater) => ({
        ...theater.toObject(),
        shows: shows.filter((show) => show.theater._id.toString() === theater._id.toString())
      }))
    });
  } catch (error) {
    console.error('Failed to fetch theaters:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch theaters' });
  }
});

//getshow by id

router.post("/getShowById", async (req, res) => {
  try {
    const show = await Show.findById(req.body.showId).populate('movie').populate('theater');
    res.status(200).json({
      success: true,
      message: "show fetched successfully",
      data: show
    });

  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message
    });
  }
});



  




module.exports = router