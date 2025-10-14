const express = require('express');
const router = express.Router();
const { submitContact, getAllContacts } = require('../controllers/contactController');

// Submit contact form
router.post('/', submitContact);

// Get all contact messages (admin usage)
router.get('/', getAllContacts);

module.exports = router;
