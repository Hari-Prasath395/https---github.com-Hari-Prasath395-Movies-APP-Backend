const mongoose = require("mongoose");

const theaterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true,unique:true },
    isActive: { type: Boolean, default: false },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    status: { type: String, enum: ["approved", "blocked", "pending"], default: "pending" },

  },
  { timestamps: true }
);

const Theater = mongoose.model("Theater", theaterSchema); 
module.exports = Theater;
