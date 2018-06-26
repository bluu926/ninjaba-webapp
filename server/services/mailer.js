const sgMail = require('@sendgrid/mail');
const mailConfig = require('../mailConfig');

const sgApiKey = process.env.SG_API_KEY || mailConfig.SG_API_KEY;

sgMail.setApiKey(sgApiKey);

// const msg = {
//   to: 'test@example.com',
//   from: 'test@example.com',
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// };
// sgMail.send(msg);

exports.sendmail = function (req, res, next) {
  sgMail.setApiKey(mailConfig.SG_API_KEY);

  const msg = {
    to: 'bluumail@gmail.com',
    from: 'admin@ninjaba.com',
    subject: 'Ninjaba Registration',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };

  sgMail.send(msg);

  res.send({success: "Sent"});
}

exports.sendRegistration = function (mailOptions) {
  const name = mailOptions.name;
  sgMail.setApiKey(mailConfig.SG_API_KEY);

  const msg = {
    from: 'admin@ninjaba.com',
    to: mailOptions.email,
    subject: 'Ninja Basketball Registration',
    html: 'Thank you <strong>' + name + '</strong> for registration to Ninja Basketball.'
  }

  sgMail.send(msg);
}
