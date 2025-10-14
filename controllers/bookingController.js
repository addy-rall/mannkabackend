// controllers/bookingController.js
const Booking = require('../models/Booking');
const transporter = require('../config/email');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

exports.createBooking = async (req, res) => {
  try {
    const { temple, firstName, lastName, email, phone, date, time, people, requirements, terms } = req.body;

    if (!temple || !firstName || !lastName || !email || !phone || !date || !time || !people) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const booking = new Booking({
      temple, firstName, lastName, email, phone, date, time, people, requirements, terms
    });

    await booking.save();

    // nicely formatted HTML email
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color:#e67e22;">🙏 Darshan Booking Confirmed</h2>
        <p>Dear <strong>${firstName} ${lastName}</strong>,</p>
        <p>Your booking for <strong>${temple}</strong> has been received and confirmed.</p>
        <table style="border-collapse:collapse;">
          <tr><td><strong>Date:</strong></td><td> ${date} </td></tr>
          <tr><td><strong>Time:</strong></td><td> ${time} </td></tr>
          <tr><td><strong>People:</strong></td><td> ${people} </td></tr>
          <tr><td><strong>Phone:</strong></td><td> ${phone} </td></tr>
        </table>
        ${requirements ? `<p><strong>Special requirements:</strong> ${requirements}</p>` : ''}
        <p>We look forward to welcoming you. 🙏</p>
        <p>— Temple Management</p>
      </div>
    `;

    const text = `Darshan booking for ${temple} on ${date} at ${time} for ${people} people.`;

    const mailOptions = {
      from: `"Temple Darshan" <${process.env.EMAIL_USER}>`,
      to: email,
      cc: ADMIN_EMAIL,              // admin receives a copy
      subject: `Darshan Booking Confirmation — ${temple}`,
      text,
      html
    };

    try {
      await transporter.sendMail(mailOptions);
      return res.status(201).json({ message: 'Booking created and email sent', booking });
    } catch (mailErr) {
      console.error('⚠️ Email send error:', mailErr);
      // We still return 201 because booking was saved successfully
      return res.status(201).json({
        message: 'Booking created, but failed to send confirmation email',
        booking,
        emailError: mailErr.message
      });
    }

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
