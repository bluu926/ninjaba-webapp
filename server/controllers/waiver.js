const Player = require('../models/player');
const User = require('../models/user');
const Waivee = require('../models/waivee');
const Waiver = require('../models/waiver');

exports.addWaiver = function(req, res, next) {
  const userEmail = req.body.email;
  const playerId = req.body.playerId;
  const bid = req.body.bid;

  console.log(playerId);
  User.findOne({ email: userEmail }, function(err, user) {
    if (err) { return next(err); }
    if (user.faab < bid) {
      return res.status(422).json({ error: 'Your bid has exceeded your budget.' });
    }

    Player.findById(playerId, function(err, player) {
      if (err) {
				return res.status(422).json({ error: 'No player was found.' });
			}

      if (player.owner != '--Free Agent--') {
  			return res.status(422).json({ error: 'Player is not available for waivers.' });
  		}

      Waiver.findOne({ active: true }, function(err, waiver) {
        if (err) { return next(err); }

        Waivee.find({ bid: bid }).count((err, numOfSameBids) => {

          let waivee = new Waivee({
            userId: user._id,
            waiverId: waiver._id,
            playerId: playerId,
            status: 'Active',
            bid: bid,
            rank: numOfSameBids + 1
          });

          return res.status(200).json({
  	        message: 'Player successfully added'
  	  		});

        });
      });
    });
  });
}
