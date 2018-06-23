const sgMail = require('@sendgrid/mail');
const mailConfig = require('../mailConfig');

sgMail.setApiKey(mailConfig.SG_API_KEY);

const msg = {
  to: 'test@example.com',
  from: 'test@example.com',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg);

exports.sendmail = function (req, res, next) {
  sgMail.setApiKey(mailConfig.SG_API_KEY);

  const msg = {
    to: 'bluumail@gmail.com',
    from: 'bluumail@gmail.com',
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };

  sgMail.send(msg);

  res.send({success: "Sent"});
}
