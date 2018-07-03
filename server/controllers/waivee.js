const Player = require('../models/player');
const User = require('../models/user');
const Waivee = require('../models/waivee');
const Waiver = require('../models/waiver');

// TODO: remove callback hell by using Promoises
exports.getOwnerWaivees = function(req, res, next) {
  const email = req.body.email;

  Waiver.findOne({ active: true }, function(err, waiver) {
    if (err) { return next(err); }

    User.findOne({ email: email }, function(err, user) {
      if (err) { return next(err); }

      Waivee.find({ userId: user._id, status: 'Active', waiverId: waiver._id }).sort({ bid: -1, rank: 1 }).exec( function(err, waivees) {
        if (err) { return next(err); }

        res.send({ waiveeList: waivees });
      });
    });
  });
}

exports.cancelWaivee = async function(req, res, next) {
  const waiveeId = req.body.waiveeId;
  const email = req.body.email;

  // get the document to remove
  const waiveeToRemove = await Waivee.findById(waiveeId);

  // remove the document
  await Waivee.findOneAndRemove({ _id: waiveeId });

  // get list of active waivees for user for particular bid
  const reorderWaiveeRanks = await Waivee.find({ userId: waiveeToRemove.userId, waiverId: waiveeToRemove.waiverId, status: 'Active', bid: waiveeToRemove.bid }).sort({ rank: 1 });

  // loop through each document and update rank based and order
  for (let i = 1; i < reorderWaiveeRanks.length + 1; i++) {
    console.log("before update #: " + i + " reorderWaiveeRanks[i-1]: " + reorderWaiveeRanks[i-1]._id + " rank: " + reorderWaiveeRanks[i-1].rank);
    if (reorderWaiveeRanks[i-1].rank != i) {
      // update both rank and originalRank
      await Waivee.findOneAndUpdate({ _id: reorderWaiveeRanks[i-1]._id }, { originalRank: i, rank: i });
      console.log("updating rank !");
    }
  }
  // get full list of waivees of user sorted by bid and rank
  const waivees = await Waivee.find({ userId: waiveeToRemove.userId, status: 'Active', waiverId: waiveeToRemove.waiverId }).sort({ bid: -1, rank: 1 })

  res.send({ waiveeList: waivees });
}

exports.changeWaiveeRank = async function(req, res, next) {
  const waiveeId = req.body.waiveeId;
  const movement = req.body.movement;

  let rankChange = -1;

  if (movement == 'up') {
    rankChange = 1;
  }
  console.log("Swapping waivers, going into the direction of : " + rankChange);
  // get the Waivee documdent
  const waiveeToMove = await Waivee.findById(waiveeId);

  // see if the rank above or below exist before proceeding
  const waiveeToSwitchWith = await Waivee.find({ waiverId: waiveeToMove.waiverId, userId: waiveeToMove.userId, status: 'Active', bid: waiveeToMove.bid, rank: waiveeToMove.rank + rankChange });
  // it exists, and we can proceed.
  if(waiveeToMove.length) {
    await Waivee.findOneAndUpdate({ _id: waiveeToMove._id }, { rank: waiveeToSwitchWith.rank });
    await Waivee.findOneAndUpdate({ _id: waiveeToSwitchWith._id }, { rank: waiveeToMove.rank });

    console.log("swapping waivee exists");
    // get full list of waivees of user sorted by bid and rank
    const waivees = await Waivee.find({ userId: waiveeToMove.userId, status: 'Active', waiverId: waiveeToMove.waiverId }).sort({ bid: -1, rank: 1 })

    res.send({ waiveeList: waivees });
  } else {
    res.send({ error: "Cannot set rank any higher." });
  }

}
