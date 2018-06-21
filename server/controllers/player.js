const Player = require('../models/player');
const config = require('../config');

const testData = require('../data/testPlayers.json')

exports.getPlayers = function (req, res, next) {
  // Player.find(function(err, players) {
	// 	if (err) { return next(err); }
  //
	// 	res.send({ playerList: players });
	// });

  res.send({ playerList: testData });
}

exports.addPlayer = function(req, res, next) {
	const playerId = req.params.playerId;
	const username = req.params.username;

	Player.findById(playerId, (err, foundPlayer) => {
		if (err) {
			return res.status(422).json({ error: 'No player was found.' });
		}

		// if player found, change it is a Free Agent
		if (foundPlayer.owner != '--free agent--') {
			return res.status(422).json({ error: 'Player is not a free agent.' });
		}

		Player.find({ owner: username}).count((err, numOfPlayers) => {
			if (err) {
				return res.status(422).json({ error: 'Unable to add free agent.' });
			}

			console.log("********* NUMBER OF PLAYERS ********** " + numOfPlayers);

			if(numOfPlayers >= 18) {
				return res.status(422).json({ error: 'Player limit reached.'});
			}

			foundPlayer.owner = username;

			foundPlayer.update({$set: {owner:username}}, (err) => {
				if (err) {
					return res.status(422).json({ error: 'Unable to add free agent.' });
				}
				return res.status(200).json({
			        message: 'Player successfully added'
		  		});
			});
		});
	});
}
