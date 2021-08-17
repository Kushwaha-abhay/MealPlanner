const express = require("express");
const { protectRoute } = require("../Controller/authController");
const { createPaymentSesion, checkoutComplete } = require("../Controller/bookingController");
const bodyParser = require("body-parser");
const bookingRouter = express.Router();
// customer : user.name,
//     customer_email : user.email,

bookingRouter.post("/createSession",protectRoute, createPaymentSesion);
bookingRouter.post("/checkoutComplete" , bodyParser.raw({type: 'application/json'}) , checkoutComplete );










module.exports = bookingRouter;