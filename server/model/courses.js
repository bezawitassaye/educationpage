const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  // Define your schema fields here
  // Example:
  name: String,
  image: String,
  size: String,
  cost: String,
  addto: String
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;