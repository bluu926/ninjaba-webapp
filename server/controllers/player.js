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
