const express = require("express");
const { protectRoute } = require("../Controller/authController");
const { createPaymentSesion } = require("../Controller/bookingController");

const bookingRouter = express.Router();
// customer : user.name,
//     customer_email : user.email,

bookingRouter.post("/createSession",protectRoute, createPaymentSesion);











module.exports = bookingRouter;