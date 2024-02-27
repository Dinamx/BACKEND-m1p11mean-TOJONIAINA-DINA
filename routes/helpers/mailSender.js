const nodemailer = require('nodemailer');
const cron = require('node-cron');
const moment = require('moment');

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
function sendEmail(receiverMail, dateToSend, mailContent,pourcentage) {
    const formattedDate = moment(dateToSend).format('LLLL');
    let mailOptions = {
        from: 'recrutementtana.pro@gmail.com',
        to: receiverMail,
        subject: `Offre spéciale`,
        text: pourcentage + '% de réduction - Offre spéciale : ' + mailContent
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log(`Email scheduled to be sent at ${dateToSend}: ` + info.response);
        }
    });
}

async function rappelEmail(receiverMail, dateToSend, service, duree, employe) {
    try {
        const formattedDate = moment(dateToSend).format('LLLL');
        let mailOptions = {
            from: 'recrutementtana.pro@gmail.com',
            to: receiverMail,
            subject: 'Rappel pour votre rendez-vous ' + service,
            text: 'vous avez un rendez vous avec' + ' ' + employe + ' pour votre' + service + ' .' + formattedDate + ' pour une durée de' + ' ' + duree + 'mn'
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email scheduled to be sent at ${dateToSend}: ` + info.response);
    } catch (error) {
        console.error('An error occurred while sending the email: ', error);
    }
}


module.exports = {
    sendEmail,
    rappelEmail
};