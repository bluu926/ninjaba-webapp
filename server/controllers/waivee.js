const Player = require('../models/player');
const User = require('../models/user');
const Waivee = require('../models/waivee');
const Waiver = require('../models/waiver');

const testData = require('../data/testWaivees.json')

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

  // res.send({ waiveeList: testData });
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
