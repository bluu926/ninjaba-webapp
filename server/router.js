const Authentication = require('./controllers/authentication');
const Player = require('./controllers/player');
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

  app.post('/api/addWaiver', Waiver.addWaiver);
  // app.get('/players',  Player.getPlayers);

  // app.get('/email', mailService.sendmail);
}
