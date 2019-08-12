const validator = require('validator');
const { validationResult } = require('express-validator');
const User = require('../models/user');

const uuidv1 = require('uuid/v1');
const apiKey = require('../config/sendGridConfig').apiKey;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(apiKey);

exports.postRegisterUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send(errors);
    }
    req.body.activationGUID = uuidv1();
    User.create(req.body);
    let activationLink = 'http:/localhost:9092/user/activation/' + req.body.activationGUID;
    const msg = {
        to: req.body.email,
        from: 'helloworld199797@gmail.com',
        subject: 'Callback Cats activation link',
        text: activationLink,
      };
      sgMail.send(msg);
    res.status(200).send('User created successful');
};

exports.getAccountActivation = (req, res, next) => { 
    User.findOne({activationGUID: req.params.activationGUID})
    .then(fetchedUser => {
        fetchedUser.activationGUID = null;
        fetchedUser.active = true;
        fetchedUser.save();
        res.status(200).send("Account is active");
    })
    .catch(err => {
        res.status(400).send("Something went wrong");
    })
}