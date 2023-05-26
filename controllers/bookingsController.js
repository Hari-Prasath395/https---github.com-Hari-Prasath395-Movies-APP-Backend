const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const Booking = require("../models/bookingModel");
const router = express.Router();
const env = require('dotenv').config();
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(stripeKey);

console.log(stripeKey);
//making payment

// router.post("/make-payment", async (req, res) => {
//   try {
//     const { token, amount } = req.body;

//     //create a customer

//     const customer = await stripe.customers.create({
//       email: token.email,
//       source: token.id,
//     });

//     //creating charges
//     const charge = await stripe.customers.create(
//       {
//         amount: amount,
//         currency: "usd",
//         customer: customer.id,
//         receipt_email: token.email,
//         description: "Purchased the movie ticket",
//       },
//       {
//         idempotencykey: Math.random().toString(36).substring(7),
//       }
//     );
//     const transactionId = charge.id;
//     res.status(200).json({
//       success: true,
//       message: "Payment Successful",
//       data: transactionId,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });
// router.post('/make-payment', async (req, res) => {
//   try {
//     const { token, amount } = req.body;

//     // Create customer
//     const customer = await stripe.customers.create({
//       email: token.email,
//       source: token.id
//     });

//     // Make charge
//     const charge = await stripe.charges.create({
//       amount: amount,
//       currency: 'usd',
//       customer: customer.id,
//       receipt_email: token.email,
//       description: 'Purchased the movie ticket'
//     }, {
//       idempotencyKey: Math.random().toString(36).substring(7)
//     });

//     const transactionId = charge.id;

//     res.status(200).json({
//       success: true,
//       message: 'Payment Successful',
//       data: transactionId
//     });
//   } catch (error) {
//     let errorMessage = 'Payment failed';

//     if (error.type === 'StripeCardError') {
//       errorMessage = error.message;
//     } else if (error.type === 'StripeInvalidRequestError') {
//       errorMessage = 'Invalid request';
//     } else if (error.type === 'StripeAPIError') {
//       errorMessage = 'Stripe API error';
//     } else if (error.type === 'StripeConnectionError') {
//       errorMessage = 'Stripe connection error';
//     } else if (error.type === 'StripeAuthenticationError') {
//       errorMessage = 'Stripe authentication error';
//     } else if (error.type === 'StripeRateLimitError') {
//       errorMessage = 'Stripe rate limit exceeded';
//     } else if (error.code === 'parameter_missing') {
//       errorMessage = 'Missing required parameter';
//     } else {
//       errorMessage = 'An unexpected error occurred';
//     }

//     res.status(500).json({ success: false, message: errorMessage });
//   }
// });

router.post('/make-payment', async (req, res) => {
  try {
    const { token, amount } = req.body;
    console.log(token,amount);
    // Create customer
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    });

    // console.log(customer);

    // Make charge
    const charge = await stripe.charges.create({
      amount: amount,
      currency: 'usd',
      customer: customer.id,
      receipt_email: token.email,
      description: 'Purchased the movie ticket'
    });

    // console.log(charge);

    const transactionId = charge.id;

    console.log(transactionId);

    res.status(200).json({
      success: true,
      message: 'Payment Successful',
      data: transactionId
    });
  } catch (error) {
    let errorMessage = 'Payment failed';

    if (error.code === 'card_declined') {
      errorMessage = 'Card declined. Please try another card.';
    } else if (error.code === 'parameter_missing') {
      errorMessage = 'Missing required parameter. Please provide all the required information.';
    } else {
      errorMessage = 'An unexpected error occurred. Please try again later.';
    }

    res.status(500).json({ success: false, message: errorMessage });
  }
});



router.post("/bookshow", async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(200).json({
      success: true,
      message: "show booked successfully",
      data: newBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
