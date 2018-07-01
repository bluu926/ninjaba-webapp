const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define user model
const playerSchema = new Schema({
  player: String,
  pos: String,
  age: Number,
  tm: String,
  g: Number,
  gs: Number,
  mp: Number,
  fg: Number,
  fga: Number,
  'fg%': Number,
  '3p': Number,
  '3pa': Number,
  '3p%': Number,
  '2p': Number,
  '2pa': Number,
  '2p%': Number,
  'efg%': Number,
  ft: Number,
  fta: Number,
  'ft%': Number,
  orb: Number,
  drb: Number,
  trb: Number,
  ast: Number,
  stl: Number,
  blk: Number,
  tov: Number,
  pf: Number,
  'ps/g': Number,
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
