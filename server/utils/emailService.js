
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pooja@punyam.app',
    pass: process.env.STOXHEROEMAILPASSWORD              //password here
  }
});

async function mailSender(to, subject, message, attachments) {
  return new Promise((resolve, reject) => {

    let mailOptions;
    if(attachments){
      mailOptions = { 
        from: 'pooja@punyam.app',      // sender address
        to: to,       // receiver address 
        subject: subject,  
        html: message, // plain text body
        attachments: attachments
      };
    } else{
      mailOptions = { 
        from: 'pooja@punyam.app',      // sender address
        to: to,       // receiver address 
        subject: subject,  
        html: message, // plain text body
      };
    }

    transporter.sendMail(mailOptions, function (err, info) {
      if(err) {
        console.log(err);
        reject(false); // Return false if email sending fails
      }
      else {
        console.log("mail sent");
        resolve(true); // Return true if email sending succeeds
      }
    });
  });
}

module.exports = mailSender;
