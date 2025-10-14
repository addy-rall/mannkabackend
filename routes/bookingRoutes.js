const express = require("express");
const router = express.Router();
const { createBooking, getBookings } = require("../controllers/bookingController");

// POST -> Create booking
router.post("/", createBooking);

// GET -> Get all bookings
router.get("/", getBookings);

module.exports = router;
