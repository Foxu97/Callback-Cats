const validator = require('../middleware/validator');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const ResetToken = require('../models/resetToken');

const uuidv1 = require('uuid/v1');
const apiKey = require('../config/sendGridConfig').apiKey;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(apiKey);

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

exports.postRegisterUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send(errors);
    }

    req.body.activationGUID = uuidv1();
    let user = new User(req.body);

    user.hashPassword()
        .then(() => {
            let activationLink = 'http://localhost:9092/user/activation/' + req.body.activationGUID;
            const msg = {
                to: req.body.email,
                from: 'helloworld199797@gmail.com',
                subject: 'Callback Cats activation link',
                text: activationLink,
            };
            sgMail.send(msg);
            res.status(200).send('User created successfuly ' + activationLink);
        })
        .catch(err => {
            console.log(err);
            res.status(401).send('Something went wrong');
        });
};

exports.getAccountActivation = (req, res, next) => {
    User.findOne({ activationGUID: req.params.activationGUID })
        .then(fetchedUser => {
            fetchedUser.activationGUID = null;
            fetchedUser.active = true;
            fetchedUser.save();
            res.status(200).send("Account is active");
        })
        .catch(err => {
            res.status(400).send("Something went wrong");
        });
};

exports.postUserSignIn = (req, res, next) => {
    let user;
    User.findOne({ email: req.body.email })
        .then(fetchedUser => {
            if (!fetchedUser) {
                return res.status(401).send("No user found");
            }
            if (!fetchedUser.active) {
                return res.status(401).send("Account is not active");
            }
            user = fetchedUser;
            return bcrypt.compare(req.body.password, fetchedUser.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).send("Auth failed");
            }

            const token = jwt.sign({
                id: user._id
            }, "secret_string", { expiresIn: "1h" });

            res.status(200).json({
                token: token,
                expiresIn: 3600
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(401).send("Something went wrong");
        });
};

exports.postForgotPassword = (req, res, next) => {
    const { email } = req.body;
    User.findOne({ email: email })
        .then(user => {
            let resetToken = new ResetToken({ userId: user._id, token: uuidv1() });
            resetToken.save((err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                let resetLink = 'http://localhost:9092/user/reset/' + resetToken.token;
                const msg = {
                    to: email,
                    from: 'helloworld199797@gmail.com',
                    subject: 'Callback Cats password reset link',
                    text: resetLink,
                };
                sgMail.send(msg);
                res.status(200).send('Password reset link has been sent on provided mail ' + resetLink);
            });
        })
        .catch(err => {
            console.log(err);
            res.status(200).send('Password reset link has been sent on provided mail.');
        });
};

exports.postResetPassword = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send(errors);
    }
    const { password } = req.body;
    ResetToken.findOne({ token: req.params.resetGUID })
        .then(token => {
            if (!token) {
                return res.status(400).send('Token not found may be expired.');
            }
            User.findOne({ _id: token.userId })
                .then(user => {
                    if (!user) {
                        return res.status(400).send('No user found');
                    }
                    user.password = password;
                    user.hashPassword()
                        .then(() => {
                            res.status(200).send('Password has been changed');
                        });
                });
        });
};

exports.putUpdateProfile = (req, res, next) => { 
    if (req.body.email) {
        if(validator.validateEmail(req.body.email)){
            User.findByIdAndUpdate(req.user._id, { email: req.body.email }, (err, result) => { 
                if (err){
                    console.log(err)
                    res.status(404).send("Updating failed");
                }
                console.log(result)
                res.status(200).send("Updated successfull");
            })
        }
        else {
            res.status(404).send("Email incorrect");
        }
    }
    if (req.body.gender) {
        if (req.body.gender.toLowerCase() === 'male' || req.body.gender.toLowerCase() === 'female'){
            User.findByIdAndUpdate(req.user._id, { gender: req.body.gender }, (err, result) => { 
                if (err){
                    console.log(err);
                    res.status(404).send("Updating failed");
                }
                console.log(result)
                res.status(200).send("Updated successfull");
            })
        }
        else{
            res.status(404).send("Gender incorrect");
        }

    }
    if (req.body.birthdate) {
        if(Date.parse(req.body.birthdate)){
            User.findByIdAndUpdate(req.user._id, { birthdate: req.body.birthdate }, (err, result) => {
                if(err){
                    console.log(err);
                    res.status(404).send("Updating failed");
                }
                console.log(result)
                res.status(200).send("Updated successfull");
            })
            .catch(err => {
                console.log(err);
                res.status(404).send("Something went wrong");
            });
        }
        else{
            res.status(404).send("Date incorrect");
        }

    }
    if (req.body.password) {
        if(validator.validatePassword(req.body.password)){
            return bcrypt.hash(req.body.password, 12)
            .then(hash => {
                User.findByIdAndUpdate(req.user._id, {password: hash}, (err, result) => {
                    if(err){
                        console.log(err);
                        res.status(404).send("Updating failed");
                    }
                    console.log(result);
                    res.status(200).send("Updated sucessfull");
                });
            })
            .catch(err => {
                console.log(err);
                res.status(404).send("Something went wrong");
            });
        }
    }


}