const nodemailer = require('nodemailer');
const {
  SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM,
} = require('../config/env');

let transporter;

if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
} else {
  // Dev: no SMTP, we "fake send" by logging the message
  transporter = {
    sendMail: async (opts) => {
      console.log('📧 [DEV MAIL] To:', opts.to);
      console.log('Subject:', opts.subject);
      console.log('Text:', opts.text);
      console.log('HTML:', opts.html);
      return { messageId: 'dev-mail' };
    },
  };
}

async function sendMail({ to, subject, text, html }) {
  return transporter.sendMail({
    from: SMTP_FROM,
    to,
    subject,
    text,
    html,
  });
}

module.exports = { sendMail };
