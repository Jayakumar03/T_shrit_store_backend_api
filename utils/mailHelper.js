const nodemailer = require("nodemailer");
require("dotenv").config();


// async..await is not allowed in global scope, must use a wrapper
 exports.mailHelper =  async (options) => {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

  // send mail with defined transport object

  const message = {
    from: "jaimech61@gmail.com", // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body

    // html: "<b>Hello world?</b>", // html body
  };

  async function main() {
  // send mail with defined transport object
     await transporter.sendMail(message);
  };

  main(message).catch(console.error);
 
}


