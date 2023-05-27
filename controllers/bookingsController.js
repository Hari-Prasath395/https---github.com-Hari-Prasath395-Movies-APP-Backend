const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const Booking = require("../models/bookingModel");
const router = express.Router();
const env = require("dotenv").config();
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(stripeKey);
const Show = require("../models/showsModel");
const Movie = require("../models/movieModel");
const Theater = require("../models/theaterModel");

router.post("/make-payment", async (req, res) => {
  try {
    const { token, amount } = req.body;

    // Validate input
    if (!token || !amount) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required parameters." });
    }

    console.log(token, amount);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "inr",
      payment_method_types: ["card"],
      receipt_email: token.email,
    });

    const transactionId = paymentIntent.client_secret;

    console.log(transactionId);

    res.status(200).json({
      success: true,
      message: "Payment initiated",
      transactionId,
    });
  } catch (error) {
    let errorMessage = "Payment failed";

    if (error.code === "card_declined") {
      errorMessage = "Card declined. Please try another card.";
    } else if (error.code === "parameter_missing") {
      errorMessage =
        "Missing required parameter. Please provide all the required information.";
    } else {
      errorMessage = "An unexpected error occurred. Please try again later.";
      console.error(error);
    }

    res.status(500).json({ success: false, message: errorMessage });
  }
});

router.post("/bookshow", async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();

    const show = await Show.findById(req.body.show);
    const updatedSeats = [...show.bookedSeats, ...req.body.seats];
    await Show.findByIdAndUpdate(req.body.show, { bookedSeats: updatedSeats });

    res.status(200).json({
      success: true,
      message: "Show booked successfully",
      data: savedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//get all bookings by user

router.get("/get-all-bookings", async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate({
      path: "show",
      populate: [
        { path: "movie", model: Movie },
        { path: "theater", model: Theater },
      ],
    });

    const filteredBookings = bookings.filter(
      (booking) => booking.show !== null
    );

    res.status(200).json({
      success: true,
      message: "All bookings fetched successfully",
      data: filteredBookings,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
