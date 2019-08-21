const sgMail = require('@sendgrid/mail');
const apiKey = require('../config/sendGridConfig').apiKey;
sgMail.setApiKey(apiKey);

const sendMail = (content, to) => {
    const msg = {
        to: to,
        from: 'helloworld199797@gmail.com',
        subject: 'Callback Cats',
        text: content,
    };
    sgMail.send(msg);
};

module.exports = sendMail;