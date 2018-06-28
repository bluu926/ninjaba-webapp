const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define user model
const waiveeSchema = new Schema({
  userId: String,
  waiverId: String,
  addPlayerId: String,
  dropPlayerId: String,
  status: String,
  bid: Number,
  rank: Number
});

// Create model class
const ModelClass = mongoose.model('waivee', waiveeSchema);

// Export model
module.exports = ModelClass;
