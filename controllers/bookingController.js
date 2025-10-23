const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const { temple, firstName, lastName, email, phone, date, time, people, requirements, terms } = req.body;

    // Validate required fields
    if (!temple || !firstName || !lastName || !email || !phone || !date || !time || !people) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create and save booking
    const booking = new Booking({
      temple, firstName, lastName, email, phone, date, time, people, requirements, terms
    });

    await booking.save();

    // Return success response
    return res.status(201).json({ 
      message: '✅ Booking created successfully', 
      booking 
    });

  } catch (err) {
    console.error('Server error (createBooking):', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    console.error('Server error (getBookings):', err);
    res.status(500).json({ error: 'Server error' });
  }
};
