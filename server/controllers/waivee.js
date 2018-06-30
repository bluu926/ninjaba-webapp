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

      Waivee.find({ userId: user._id, status: 'Active', waiverId: waiver._id }).sort({ bid: -1 }).exec( function(err, waivees) {
        if (err) { return next(err); }

        res.send({ wavieeList: waivees });
      });
    });
  });
  // res.send({ waiveeList: testData });
}
