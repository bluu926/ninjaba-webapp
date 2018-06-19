const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define user model
const playerSchema = new Schema({
  Tm: String,
  Player: String,
  Age: Number
});

// Create model class
const ModelClass = mongoose.model('player', playerSchema);

// Export model
module.exports = ModelClass;
