const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  temple: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  people: { type: String, required: true },
  requirements: { type: String },
  terms: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);
