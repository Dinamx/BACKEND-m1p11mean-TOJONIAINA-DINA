const nodemailer = require('nodemailer');
const cron = require('node-cron');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'recrutementtana.pro@gmail.com ',
        pass: 'sbva cgrh cggr eate'
    }
});

// function sendEmail(receiverMail, dateToSend, mailContent) {
//     let mailOptions = {
//         from: 'yourusername@gmail.com',
//         to: receiverMail,
//         subject: `Email to be sent on ${dateToSend}`,
//         text: mailContent
//     };
//
//     // Planifiez l'envoi de l'e-mail à la date spécifiée
//     cron.schedule(dateToSend, function(){
//         transporter.sendMail(mailOptions, function(error, info){
//             if (error) {
//                 console.log(error);
//             } else {
//                 console.log(`Email scheduled to be sent at ${dateToSend}: ` + info.response);
//             }
//         });
//     });
// }
function sendEmail(receiverMail, dateToSend, mailContent) {
    let mailOptions = {
        from: 'recrutementtana.pro@gmail.com',
        to: receiverMail,
        subject: `Offre spéciale`,
        text: mailContent
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log(`Email scheduled to be sent at ${dateToSend}: ` + info.response);
        }
    });
}

module.exports = sendEmail;