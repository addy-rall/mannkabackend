// =============================================================================
// || DATABASE CONFIGURATION                                                  ||
// =============================================================================
// || This file contains the logic for connecting to the MongoDB database.    ||
// =============================================================================

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://mannka:mannka@cluster0.fkzdikc.mongodb.net/';
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected Successfully!');
  } catch (err) {
    console.error('MongoDB Connection Failed:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
