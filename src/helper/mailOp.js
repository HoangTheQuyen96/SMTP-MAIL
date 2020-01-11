const config = require('config');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const sendEmail = payload =>
  new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport(
      smtpTransport({
        service: config.get('smtpSettings.service'),
        auth: {
          user: config.get('smtpSettings.user'),
          pass: config.get('smtpSettings.pass'),
        },
      })
    );

    const mailOptions = {
      from: 'Do Not Reply, Comspaces Company',
      to: payload.emails.toString(),
      subject: `Your Notifications`,
      html: ` <h1>${payload.notification}</h1>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject(new Error(`An error occured sending an email, err:${err}`));
      }
      transporter.close();
      resolve(info);
    });
  });

module.exports = {
  sendEmail,
};
