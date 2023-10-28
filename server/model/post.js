const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  // Define your schema fields here
  // Example:
  name: String,
  image: String,
  size: String,
  price: Number,
  addto: String,
 
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;