const sgMail = require('@sendgrid/mail');
const apiKey = require('../config/sendGridConfig').apiKey;
sgMail.setApiKey(apiKey);

const sendMail = (content, to) => {
    const msg = {
        to: to,
        from: 'helloworld199797@gmail.com',
        subject: 'ShareIt',
        html: '<h1>Welcome to ShareIt!<h1><br><p>To start using our site just click the link below</p> ' + content,
    };
    sgMail.send(msg);
};

module.exports = sendMail;