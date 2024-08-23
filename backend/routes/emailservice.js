/* const emailjs = require('emailjs-com');
require('dotenv').config();

emailjs.init('your_user_id');

function sendVerificationEmail(toEmail, verificationLink) {
    const templateParams = {
        to_email: toEmail,
        verification_link: verificationLink
    };

    emailjs.send('your_service_id', 'your_template_id', templateParams)
        .then((response) => {
            console.log('Email sent successfully:', response.status, response.text);
        })
        .catch((error) => {
            console.error('Error sending email:', error);
        });
}

module.exports = sendVerificationEmail;
 */