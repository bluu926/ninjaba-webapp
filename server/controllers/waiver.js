const Player = require('../models/player');
const User = require('../models/user');
const Waivee = require('../models/waivee');
const Waiver = require('../models/waiver');

exports.getPlayersToDrop = function(req, res, next) {
  const userEmail = req.body.email;
  const bid = req.body.bid;

  User.findOne({ email: userEmail }, function(err, user) {
    if (err) { return next(err); }

    if (user.faab < bid) {
      return res.status(422).json({ error: 'Your dont have enough faab to cover bid.' });
    }

    Player.find({ owner: userEmail }, function(err, players) {
  		if (err) { return next(err); }

  		res.send({ playerToDropList: players, playerCount: players.length });
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
              addPlayerName: addPlayer.player,
              dropPlayerId: dropPlayerId,
              dropPlayerName: dropPlayer.player,
              status: 'Active',
              bid: bid,
              rank: numOfSameBids + 1,
              originalRank: numOfSameBids + 1
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

exports.test = async function(req, res, next) {
  // get current 'Active' status from waiver collection
  const waiver = await Waiver.findOne({ active: true });

  // get all 'Active' status bids from waivee collection
  // AND all bids from the 'Active' waiver
  // also put all the Bids is order from highest to lowest
  // const waivees = await Waivee.find({ status: 'Active' }).sort({ bid: -1 });
  //
  // // process all waivee
  // // Take the player current highest active bid (same players with same dont matter since its priority will be taken care of later)
  // for (let waivee of waivees) {
  //   console.log(waivee.bid + "  " + waivee._id);
  //
  //   // see if the next waivee is still 'Active'.
  //   const currentWaivee = await Waivee.findById(waivee._id);
  //   console.log("***" + currentWaivee.bid + " | " + currentWaivee.status);
  //
  //   if (currentWaivee.status == 'Active') {
  //
  //     const waiveeGroup = await Waivee.find({ waiverId: waivee.waiverId, status: 'Active', bid: waivee.bid, addPlayerId: waivee.addPlayerId }).sort({ rank: 1 });
  //
  //     for (let i = 0; i < waiveeGroup.length; i++) {
  //         let text = waiveeGroup[i];
  //         console.log(text.bid + "  |  " + text.rank);
  //     }
  //
  //   }
  // }
  //
  // console.log("*****" + waiver);
}


exports.processWaiver = async function(req, res, next) {
  // get current 'Active' status from waiver collection
  const waiver = await Waiver.findOne({ active: true });
// await Waivee.update({}, { status: 'Active'}, {multi: true});
  // get all 'Active' status bids from waivee collection
  // AND all bids from the 'Active' waiver
  // also put all the Bids is order from highest to lowest
  const waivees = await Waivee.find({ status: 'Active' }).sort({ bid: -1 });

  // process all waivee
  // Take the player current highest active bid (same players with same dont matter since its priority will be taken care of later)
  for (let currentWaivee of waivees) {
    console.log("current processing waivee: " + currentWaivee.bid + " | " + currentWaivee._id + " | " + currentWaivee.rank + " | " + currentWaivee.status + " | " + waivees.length);

    // see if the next waivee is still 'Active'.
    currentWaivee = await Waivee.findById(currentWaivee._id);
    console.log("updated processing waivee: " + currentWaivee.bid + " | " + currentWaivee._id + " | " + currentWaivee.rank + " | " + currentWaivee.status + " | " + currentWaivee.addPlayerId + " || "+ waivees.length);

    if (currentWaivee.status == 'Active') {
      // get all the same active bids and reorder the ranks
      // we need to reorder to take into acount of all the Cancelled and Lost bids
      const reorderWaiveeGroup = await Waivee.find({ waiverId: currentWaivee.waiverId, status: 'Active', bid: currentWaivee.bid, addPlayerId: currentWaivee.addPlayerId }).distinct("userId");
      console.log(reorderWaiveeGroup);

      // get list of all the owners the have same players as the current bid
      for (let sameOwnerReorderGroup of reorderWaiveeGroup) {
        console.log("same owner: + " + sameOwnerReorderGroup);

        const sameOwnerBidGroup = await Waivee.find({ userId: sameOwnerReorderGroup, waiverId: currentWaivee.waiverId, status: 'Active', bid: currentWaivee.bid, addPlayerId: currentWaivee.addPlayerId }).sort({ rank: 1 });

        for (let i = 1; i < sameOwnerBidGroup.length + 1; i++) {
          console.log("before update #: " + i + " sameOwnerBidGroup[i-1]: " + sameOwnerBidGroup[i-1]._id + " rank: " + sameOwnerBidGroup[i-1].rank);
          if (sameOwnerBidGroup[i-1].rank != i) {
            await Waivee.findOneAndUpdate({ _id: sameOwnerBidGroup[i-1]._id }, { rank: i });
            console.log("updating rank !");
          }
        }
      }

      console.log("reordering done!");
      //TODO refresh currentWaivee
      // get all waivees with same bid for same addplayer
      const waiveeGroup = await Waivee.find({ waiverId: currentWaivee.waiverId, status: 'Active', bid: currentWaivee.bid, addPlayerId: currentWaivee.addPlayerId, rank: 1 });

      console.log("number of rank 1s for current bid: " + waiveeGroup.length);

      // see if there are multiple rank 1s
      if (waiveeGroup.length > 1) {
        let groupOfOwnersWithSameRank = [];

        for (let i = 0; i < waiveeGroup.length; i++) {
            // check to see which owner has the highest waiver priority
            groupOfOwnersWithSameRank.push(waiveeGroup[i].userId);
            console.log("list of owners with same rank: " + groupOfOwnersWithSameRank);
        }

        // get the user with the highest waiver priority
        const waiveeWithHighestOwnerWaiverPriority = await User.find({ _id: { $in: groupOfOwnersWithSameRank } }).sort({ waiverPriority: 1 }).limit(1);

        let highestPriority = waiveeWithHighestOwnerWaiverPriority[0]._id;
        console.log("highestPriority: " + highestPriority);

        for (let i = 0; i < waiveeGroup.length; i++) {
            // check to see which owner has the highest waiver priority
            console.log("finding the user with the highest priority: " + waiveeGroup[i].userId);
            console.log("with the highest : " + highestPriority);
            if (waiveeGroup[i].userId == highestPriority) {
              console.log("found the winner with the highest waiver priority");
              await processWinner(waiveeGroup[i]);
            }
        }

      } else {
        console.log("only 1 rank 1 for this bid");
        await processWinner(currentWaivee);
      }
    }
  }

  console.log("*****" + waiver);

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

async function processWinner(waivee) {
  console.log("Waivee has won : " + waivee._id);

  // subtract bid from faab for wionner
  await User.findOneAndUpdate({ _id: waivee.userId }, { "$inc": { faab: -waivee.bid } });

  const owner = await User.findById(waivee.userId);

  // add the player to the winner owner and set waivee to Won
  await Player.findOneAndUpdate({ _id: waivee.addPlayerId }, { owner: owner.email });
  console.log("updated and won! new faab is: " + owner.faab);

  await Waivee.findOneAndUpdate({ _id: waivee._id }, { status: "Won" });

  // drop player specified in winning waiver if needed
  if (waivee.dropPlayerId !== "") {
    await Player.findOneAndUpdate({ _id: waivee.dropPlayerId }, { owner: "--Free Agent--"});
  } else {
    console.log("empty dont delete");
  }

  // check roster space, if max, Cancel all dropless adds
  const playerCount =  await Player.find({ owner: owner.email }).count();
  console.log("total players now: " + playerCount);

  if (playerCount < 18) {
    await Waivee.update({ dropPlayerId: "", status: "Active", waiverId: waivee.waiverId }, { status: "Cancelled" }, {multi: true});
    console.log("Cancelling all dropless waivers");
  }

  // cancel all waivees that have the same drop player
  if (waivee.dropPlayerId !== "") {
    await Waivee.update({ dropPlayerId: waivee.dropPlayerId, status: "Active", waiverId: waivee.waiverId }, { status: "Cancelled" }, {multi: true});
    console.log("Cancelling all same droplayerid waivees");
  }

  // cancel all waivees that dont have even faab to over bid
  await Waivee.update({ status: "Active", userId: owner._id, bid: { "$gt": owner.faab }, waiverId: waivee.waiverId}, { status: "Cancelled" }, {multi: true});
  console.log("Cancelling all bids that cant be covered by faab");

  // cancel all waives that have the same addPlayerId
  await Waivee.update({ status: "Active", waiverId: waivee.waiverId, addPlayerId: waivee.addPlayerId }, { status: "Cancelled" }, {multi: true});
  console.log("Cancelling all bids that have the same addPlayerId as the winner");

  // reorder ranks
// await Waivee.update({}, { status: 'Active'}, {multi: true});
}
