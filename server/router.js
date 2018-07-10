const Authentication = require('./controllers/authentication');
const Player = require('./controllers/player');
const Transaction = require('./controllers/transaction');
const Waivee = require('./controllers/waivee');
const Waiver = require('./controllers/waiver');
const passportService = require('./services/passport');
const passport = require('passport');
const mailService = require('./services/mailer');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', {session: false} );

module.exports = function(app) {
  app.get('/', requireAuth, function(req, res) {
    res.send({ hi: 'there'});
  });
  app.post('/api/signin', requireSignin, Authentication.signin);
  app.post('/api/signup', Authentication.signup);

  app.get('/api/players', requireAuth, Player.getPlayers);
  app.get('/api/playertransaction/:playerId/:username/add', requireAuth, Player.addPlayer);
  app.get('/api/playertransaction/:playerId/:username/drop', requireAuth, Player.dropPlayer);

  app.get('/api/transaction/getTransactions', requireAuth, Transaction.getTransactions);

  app.post('/api/waiver/addWaiver', requireAuth, Waiver.addWaiver);
  app.post('/api/waiver/getPlayersToDrop', requireAuth, Waiver.getPlayersToDrop);

  app.post('/api/waiver/processwaivers', Waiver.processWaiver);

  app.post('/api/waivee/getOwnerWaivees', requireAuth, Waivee.getOwnerWaivees);
  app.post('/api/waivee/cancelWaivee', requireAuth, Waivee.cancelWaivee);
  app.post('/api/waivee/changeWaiveeRank', requireAuth, Waivee.changeWaiveeRank);
  app.post('/api/waiver/test', Waiver.test);
}
