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
	addPlayerName: {
		type: String,
		default: ''
	},
	dropPlayerName: {
		type: String,
		default: ''
	},
	waiverAmount: {
		type: Number,
		default: 0
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
