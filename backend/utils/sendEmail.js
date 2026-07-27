const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const message = {
    from: '"BioGasCalc Promo" <noreply@biogascalc.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `<p>${options.message.replace(/\n/g, '<br>')}</p>`,
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

module.exports = sendEmail;
