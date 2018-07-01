const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define user model
const waiveeSchema = new Schema({
  userId: String,
  waiverId: String,
  addPlayerId: String,
  addPlayerName: String,
  dropPlayerId: String,
  dropPlayerName: String,
  status: String,
  bid: Number,
  rank: Number,
  originalRank: Number
},
{
	timestamps: true
});
// Create model class
const ModelClass = mongoose.model('waivee', waiveeSchema);

// Export model
module.exports = ModelClass;
