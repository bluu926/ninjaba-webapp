const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define user model
const playerSchema = new Schema({
  tm: String,
  player: String,
  age: Number,
  fg: Number,
  fga: Number,
  'fg%': Number,
  image: String,
  owner: {
    type: String,
    default: '--Free Agent--'
  }
});

// Create model class
const ModelClass = mongoose.model('player', playerSchema);

// Export model
module.exports = ModelClass;
