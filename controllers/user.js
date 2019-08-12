const validator = require('validator');
const { validationResult } = require('express-validator');
const User = require('../models/user');

const uuidv1 = require('uuid/v1');
const apiKey = require('../config/sendGridConfig').apiKey;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(apiKey);

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const saltRounds = 12;

exports.postRegisterUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send(errors);
    }
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            req.body.password = hash;
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
        });
    });
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

exports.postUserSignIn = (req, res, next) => { 
    let user;
    User.findOne({email: req.body.email})
    .then(fetchedUser => { 
        if(!fetchedUser){
            return res.status(401).send("No user found");
        }
        if(!fetchedUser.active){
            return res.status(401).send("Account is not active");
        }
        user = fetchedUser;
        return bcrypt.compare(req.body.password, fetchedUser.password);
    })
    .then(result => {
        if(!result) {
            return res.status(401).send("Auth failed");
        }
        const token  = jwt.sign({
            email: user.email
        }, "secret_string", {expiresIn: "1h"});
        res.status(200).json({
            token: token,
            expiresIn: 3600
        });
    })
    .catch(err => {
        console.log(err)
        return res.status(401).send("Something went wrong");
    })
}