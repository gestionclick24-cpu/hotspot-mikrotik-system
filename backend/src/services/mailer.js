const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT || '587',10),
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
});

async function sendMail(to, subject, text, html){
  return transporter.sendMail({ from: process.env.MAIL_USER, to, subject, text, html });
}

async function sendWelcomeWithCredentials(email, username, password, expires_at){
  const subject = 'Tus credenciales Hotspot';
  const text = `Usuario: ${username}\nContraseña: ${password}\nExpira: ${expires_at}`;
  return sendMail(email, subject, text, null);
}

module.exports = { sendMail, sendWelcomeWithCredentials };
