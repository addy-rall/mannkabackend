const Contact = require('../models/Contact');

// @desc    Submit a contact form
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, msg: "Name, email, and message are required" });
    }

    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();

    res.status(201).json({ success: true, msg: "Message received successfully!" });
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({ success: false, msg: "Server error. Please try again later." });
  }
};

// @desc    Get all contact messages (for admin)
// @route   GET /api/contact
// @access  Private (later with auth)
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
