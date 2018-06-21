const Player = require('../models/player');
const Transaction = require('../models/transaction');
const config = require('../config');

exports.recordTransaction = function(req, res, next) {
	const username = req.params.username;
	const transactionType = req.params.transactionType;
	const playerId = req.params.playerId;

	User.findOne({ username: username}, function(err, foundUser) {
		if (err) {
	    res.status(422).json({ error: 'No user was found.' });
			return next(err);
		}

		Player.findById(playerId, (err, foundPlayer) => {
			if (err) {
				return res.status(422).json({ error: 'No player was found.' });
			}

			let transaction = new Transaction({
		  	username: username,
				firstName: foundUser.profile.firstName,
				lastName: foundUser.profile.lastName,
				transactionType: transactionType,
				playerName: foundPlayer.player
			});

			transaction.save(function(err, transaction) {
		  	if (err) { return next(err); }

				console.log('****** TRANSACTION SAVED ******');
			});
		});
	});
}
