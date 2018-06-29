const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define user model
const waiverSchema = new Schema({
  waiverNumber: Number,
  active: Boolean,
  activityLog: [{
    owner: String,
    player: String,
    message: String
  }]
});

// Create model class
const ModelClass = mongoose.model('waiver', waiverSchema);

// Export model
module.exports = ModelClass;
