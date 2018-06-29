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

exports.test = function(req, res, next) {
  // get current 'Active' status from waiver collection

  Waiver.findOne({ active: true }, function(err, waiver) {
    if (err) { return next(err); }

    Waiver.find({ status: 'Active' }).sort({ bid: -1 })
      .cursor()
      .eachAsync(waivees => {
        console.log('hi')
      })
      .then(() => console.log('done!'));
  });
}


exports.processWaiver = function(req, res, next) {
  // get current 'Active' status from waiver collection
  Waiver.findOne({ active: true }, function(err, waiver) {
    if (err) { return next(err); }

    // get all 'Active' status bids from waivee collection
    // AND all bids from the 'Active' waiver
    // also put all the Bids is order from highest to lowest
    Waivee.find({ status: 'Active' }).sort({ bid: -1 }).exec( function(err, waivees) {
      if (err) { return next(err); }

      // process all waivee
      // Take the player current highest active bid (same players with same dont matter since its priority will be taken care of later)
      waivees.forEach(function(waivee){
        console.log("******" + waivee.bid);
        // see if the next waivee is still 'Active'.
        Waivee.findById(waivee._id, function(err, currentWaivee) {
          if (err) { return next(err); }

          console.log("******" + waivee.bid);

          if (currentWaivee.status == 'Active') {

            Waivee.find({ waiverId: waivee.waiverId, status: 'Active', bid: waivee.bid, addPlayerId: waivee.addPlayerId }).sort({ rank: 1 }).exec( function(err, waiveeGroup) {
              if (err) { return next(err); }

              console.log("*****");
              waiveeGroup.forEach(function(processGroup) {
                console.log(processGroup.bid + ' ' + processGroup.rank);
              })

            });
          }

        });

      });

    });
  });

  // If there are no ties of bids for this player, the owner of the bid has won
  // Note: This applies everytime a bid has been won
  // 0.  Set the status of the winning waivee bid to 'Won' from 'Active'
  // 1.  Drop the player if specified by the waivee
  // 2.  If there was no player to drop, this means that they had roster space.
  //     Perform a check to see if they have reached roster 'max', if they have, marked
  //     ALL dropless waivers (waivers with no drops) to be 'Cancelled' status
  // 3.  next, if there was a player that was dropped during the win, mark all other 'Active' waivers
  //     that is using the same drop player to be 'Cancelled' status.
  // 4.  Next look at how much faab is remaining for the winner, proceed to 'Cancelled' all other 'Active'
  //     bids that have the bids greater than remaining faab.
  // 5.  Next look to see if the winning owner has other adds with the Player they just won.
  //     If so, set their status to 'Cancelled'
  // 6.  Any time 0,2-5 has been done, we need to resort the ranking so that owner priority is maintained.
  //     Anytime there is a 'Won', 'Cancelled' or 'Lost', look at the bids for those waivees,
  //     and see if there are any other 'Active' status waivees that have the same bids
  //     from the same owner.
  //     If there are any same bids that are 'Active', group them together and order by rank.
  //     Then proceed to update their ranks based on their order, starting with 1.


  // If there is a tie, look to see who has prioritized their waiver rank higher
  // If there is a clear winner (highest rank with no tie), owner has won
  // Note:  This applies everytime a bid has been won (from section above)
  // 0.  Set the status of the waivees who do not have the highest rank to 'Lost'
  //     Set the status of the winning waivee bid to 'Won' from 'Active'.
  // 1-6.  Will be the same as above.


  // If there is a tie in bid, and a tie in the prioritzed rank of their waiver.
  // Look at the owner list waiver priority, give it to the owner with the highest priority
  // proceed to move winning owner to end of waiver priority ( move everyone else up )
  // 0.  Set the status of the waviees who tied in a bid and rank, but lost in priority waiver to
  //     'Lost'.  Set the status of the winning waivee bid to 'Won' from 'Active'.
  // 0a. Reorder the priority waiver.
  // 1-6.  Will be the same as above.

  // Loop above until no more 'Active' bids exist.


}
