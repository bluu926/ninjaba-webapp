const Player = require('../models/player');
const User = require('../models/user');
const Waivee = require('../models/waivee');
const Waiver = require('../models/waiver');

exports.getPlayersToDrop = function(req, res, next) {
  const userEmail = req.body.email;

  User.findOne({ email: userEmail }, function(err, user) {
    if (err) { return next(err); }

    Player.find({ owner: userEmail }, function(err, players) {
  		if (err) { return next(err); }

  		res.send({ playerToDropList: players, playerCount: players.count });
  	});
  });
}

exports.addWaiver = function(req, res, next) {
  const userEmail = req.body.email;
  const addPlayerId = req.body.addPlayerId;
  const dropPlayerId = req.body.dropPlayerId;
  const bid = req.body.bid;

  User.findOne({ email: userEmail }, function(err, user) {
    if (err) { return next(err); }
    if (user.faab < bid) {
      return res.status(422).json({ error: 'Your bid has exceeded your budget.' });
    }

    Player.findById(addPlayerId, function(err, addPlayer) {
      if (err) {
				return res.status(422).json({ error: 'No player was found.' });
			}
      console.log(addPlayer._id);
      if (addPlayer.owner != '--Free Agent--') {
  			return res.status(422).json({ error: 'Player is not available for waivers.' });
  		}

      Player.findById(dropPlayerId, function(err, dropPlayer) {
        if (err) {
  				return res.status(422).json({ error: 'No player was found.' });
  			}

        if (dropPlayer.owner != userEmail) {
    			return res.status(422).json({ error: 'Player is not on your team.' });
    		}

        Waiver.findOne({ active: true }, function(err, waiver) {
          if (err) { return next(err); }

          console.log(waiver);
          Waivee.find({ userId: user._id, waiverId: waiver._id, bid: bid }).count((err, numOfSameBids) => {

            let waivee = new Waivee({
              userId: user._id,
              waiverId: waiver._id,
              addPlayerId: addPlayerId,
              dropPlayerId: dropPlayerId,
              status: 'Active',
              bid: bid,
              rank: numOfSameBids + 1
            });

            waivee.save(function(err, waivee) {
              if (err) { return next(err); }

              console.log('****** WAIVEE SAVED ******');
              return res.status(200).json({
                message: 'Waiver Successfully placed'
              });

            });
          });
        });
      });
    });
  });
}
