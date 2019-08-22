const User = require('../models/user');
const ResetToken = require('../models/resetToken');
const sendMail = require('../utils/sendMail');

const uuidv1 = require('uuid/v1');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

exports.postRegisterUser = (req, res, next) => {
    req.body.activationGUID = uuidv1();
    let user = new User(req.body);

    user.hashPassword()
        .then(() => {
            const activationLink = 'http://localhost:9092/user/activation/' + req.body.activationGUID;
            sendMail(activationLink, req.body.email);
            res.status(200).send('User created successfuly ' + activationLink);
        })
        .catch(err => {
            res.status(401).send(err.message);
        });

};

exports.getAccountActivation = (req, res, next) => {
    User.findOne({ activationGUID: req.params.activationGUID })
        .then(fetchedUser => {
            if (!fetchedUser) {
                throw new Error('No user with that activation ID found!');
            }
            fetchedUser.activationGUID = null;
            fetchedUser.active = true;
            return fetchedUser.save();
        })
        .then(() => {
            res.status(200).send("Account is active");
        })
        .catch((err) => {
            res.status(400).send({
                message: String(err)
            });
        });
};

exports.postUserSignIn = (req, res, next) => {
    let user;
    User.findOne({ email: req.body.email })
        .then(fetchedUser => {
            if (!fetchedUser) {
                throw new Error('Invalid credentials');
            }
            if (!fetchedUser.active) {
                throw new Error('Account is not active');
            }
            user = fetchedUser;
            return bcrypt.compare(req.body.password, fetchedUser.password);
        })
        .then(result => {
            if (!result) {
                throw new Error('Auth failed');
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
            res.status(401).send({
                "message": String(err)
            });
        });
};

exports.postForgotPassword = (req, res, next) => {
    const { email } = req.body;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                throw new Error('No e-mail found in the database');
            }
            let resetToken = new ResetToken({ userId: user._id, token: uuidv1() });
            resetToken.save((err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                let resetLink = 'http://localhost:9092/user/reset/' + resetToken.token;
                sendMail(resetLink, email);
                res.status(200).send('Password reset link has been sent on provided mail ' + resetLink);
            });
        })
        .catch(err => {
            console.log(err);
            res.status(200).send('Password reset link has been sent on provided mail.');
        });
};

exports.postResetPassword = (req, res, next) => {
    const { password } = req.body;
    ResetToken.findOne({ token: req.params.resetGUID })
        .then(token => {
            if (!token) {
                throw new Error('Token not found may be expired.');
            }
            return User.findOne({ _id: token.userId });
        })
        .then(user => {
            if (!user) {
                throw new Error('No user found');
            }
            user.password = password;
            user.hashPassword()
                .then(() => {
                    res.status(200).send('Password has been changed');
                });
        })
        .catch(err => {
            res.status(400).send({
                "message": String(err)
            });
        });
};

exports.putUpdateProfile = (req, res, next) => {
    if(req.body.role){
        return res.status(401).send("Only admin can change users role");
    }
    User.findByIdAndUpdate(req.user._id, req.body, (err, result) => {
        if(err){
            console.log(err);
            res.status(404).send("Updating failed");
        }
        res.status(404).send("Updating ok");
    });
}
exports.deleteProfile = (req, res, next) => { 
    User.findByIdAndDelete(req.user._id, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).send("Something went wrong");
        }
        res.status(200).send("Account deleted");
    })
}