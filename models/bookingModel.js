const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    show: { type: mongoose.Schema.Types.ObjectId, ref: "Show" }, // Update the model name to match the actual Show model
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Update the model name to match the actual User model
    seats: { type: Array, required: true },
    transactionId: { type: String, required: true },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
