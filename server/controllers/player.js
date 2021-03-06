const Player = require('../models/player')
const Transaction = require('../models/transaction')
const config = require('../config');
const WaiverController = require('./waiver');

const testData = require('../data/testPlayers.json')

exports.getPlayers = async function (req, res, next) {
  let email;

  // get email from jwt token
  if (req.headers && req.headers.authorization) {
    console.log("Here it is: " + req.headers.authorization);
    try {
        const user = await WaiverController.getUserFromToken(req.headers.authorization);
        email = user.email;
    } catch (e) {
      console.log('errored! ' + e);
      return res.status(401).send({ error: "Unauthorized" });
    }
    //console.log('waivee decoded email : ' + email.email);
  } else {
    return res.status(401).send({ error: "Unauthorized" });
  }

  console.log('email retrieved from jwt: ' + email);

  Player.find().sort({ player: 1 }).exec(function(err, players) {
		if (err) { return next(err); }

		res.send({ playerList: players, ownerEmail: email });
	});

  // res.send({ playerList: testData });
}

exports.addPlayer = function(req, res, next) {
	const playerId = req.params.playerId;
	const username = req.params.username;
  const transactionType = 'add';

	Player.findById(playerId, (err, foundPlayer) => {
		if (err) {
			return res.status(422).json({ error: 'No player was found.' });
		}

		// if player found, change it is a Free Agent
		if (foundPlayer.owner != '--Free Agent--') {
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

        // Save TRANSACTION
        let error = recordTransaction(username, transactionType, foundPlayer.player);
        if (error) {
          console.log('****** TRANSACTION ERROR ******');
          return res.status(422).json({ error: 'Unable to save transaction.' });
        }

				return res.status(200).json({
	        message: 'Player successfully added'
	  		});
			});
		});
	});
}

exports.dropPlayer = function(req, res, next) {
	const playerId = req.params.playerId;
	const username = req.params.username;
  const transactionType = 'drop';

	Player.findById(playerId, (err, foundPlayer) => {
		if (err) {
			return res.status(422).json({ error: 'No player was found.' });
		}

		// if player found, change it is a Free Agent
		if (foundPlayer.owner != username) {
			return res.status(422).json({ error: 'You are not owner.' });
		}

		foundPlayer.owner = username;

		foundPlayer.update({$set: {owner:'--Free Agent--'}}, (err) => {
			if (err) {
				return res.status(422).json({ error: 'Unable to drop player.' });
			}

      // Save TRANSACTION
      let error = recordTransaction(username, transactionType, foundPlayer.player);
      if (error) {
        console.log('****** TRANSACTION ERROR ******');
        return res.status(422).json({ error: 'Unable to save transaction.' });
      }

			return res.status(200).json({
        message: 'Player successfully dropped'
  		});
		});
	});
}

function recordTransaction(username, transactionType, playerName) {
  let transaction = {};

  // add
  if (transactionType == 'add') {
    transaction = new Transaction({
      username: username,
      transactionType: transactionType,
      playerName: playerName
    });
  // drop
  } else if (transactionType == 'drop') {
    transaction = new Transaction({
      username: username,
      transactionType: transactionType,
      dropPlayerName: playerName
    });
  }

  transaction.save(function(err, transaction) {
    if (err) { return err; }

    console.log('****** TRANSACTION SAVED ******');
  });
}
