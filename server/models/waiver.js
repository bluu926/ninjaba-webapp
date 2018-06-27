const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define user model
const waiverSchema = new Schema({
  waiverNumber: Number,
  status: String,
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
