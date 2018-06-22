const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'ninjaba-webapp', // generated ethereal user
            pass: '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' // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'noreplay', // sender address
        to: 'bluumail@gmail.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
});

exports.sendmail = function (req, res, next) {
  // Configure Nodemailer SendGrid Transporter
  const transporter = nodemailer.createTransport(
    sendgridTransport({
      auth: {
        api_user: process.env.SENDGRID_API_USER,    // SG username
        api_key: process.env.SENDGRID_API_PASSWORD, // SG password
      },
    })
  );

  // setup email data with unicode symbols
  let mailOptions = {
      from: 'noreplay', // sender address
      to: 'bluumail@gmail.com', // list of receivers
      subject: 'Hello ✔', // Subject line
      html: '<b>Hello world?</b>' // html body
  };
  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);

      res.send({ success: "Email Sent"});

      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  });
}
