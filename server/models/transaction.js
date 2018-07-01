const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
	username: {
	  type: String,
		required: true
	},
	transactionType: {
		type: String,
		required: true
	},
	playerName: {
		type: String,
		required: true
	}
},
{
  	timestamps: true
});

// // Create model class
// const ModelClass = mongoose.model('transaction', TransactionSchema);
//
// // Export model
// module.exports = ModelClass;
module.exports = mongoose.model('transaction', TransactionSchema);
