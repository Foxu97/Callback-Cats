const User = require('../models/user');
const ResetToken = require('../models/resetToken');
const sendMail = require('../utils/sendMail');
const validationHandle = require('../utils/validationHandle');

const uuidv1 = require('uuid/v1');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const _ = require('lodash');


exports.postRegisterUser = async (req, res, next) => {
    if (validationHandle(req, res)) return;

    let user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        activationGUID: uuidv1(),
        birthdate: req.body.birthdate,
        gender: req.body.gender,
        role: req.body.role,
        bio: req.body.bio,
        country: req.body.country,
        city: req.body.city
    });

    await user.hashPassword();

    const activationLink = 'http://localhost:9092/user/activation/' + user.activationGUID;
    sendMail(activationLink, user.email);
    res.status(200).send('User created successfuly ' + activationLink);
};

exports.getAccountActivation = async (req, res, next) => {
    let user = await User.findOne({ activationGUID: req.params.activationGUID });

    if (!user) return res.status(400).send({
        message: 'No user with that activation ID found'
    });

    user.activationGUID = undefined;
    user.active = true;
    await user.save();
    res.status(200).send({
        message: 'Account has been activated'
    });
};

exports.postUserSignIn = async (req, res, next) => {
    let user = await User.findOne({ email: req.body.email }).select('+active +password');
    if (!user) return res.status(400).send({
        message: 'Invalid credentials'
    });

    if (!user.active) return res.status(400).send({
        message: 'Account has not been yet activated'
    });

    let result = await bcrypt.compare(req.body.password, user.password);
    if (!result) return res.status(400).send({
        message: 'Authentication failed'
    });

    return res.status(200).send({
        message: 'User has been logged in',
        jwt: jwt.sign({
            id: user._id
        }, process.env.PASSPORT_SECRET, { expiresIn: "1h" })
    });

};

exports.postForgotPassword = async (req, res, next) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send({
            message: 'No e-mail found in the database'
        });
    }

    let resetToken = new ResetToken({ userId: user._id, token: uuidv1() });
    await resetToken.save();
    let resetLink = 'http://localhost:9092/user/reset/' + resetToken.token;
    sendMail(resetLink, user.email);
    return res.status(200).send({
        message: 'Password reset link has been sent on provided mail ' + resetLink
    });
};

exports.postResetPassword = async (req, res, next) => {
    if (validationHandle(req, res)) return;

    let resetToken = await ResetToken.findOne({ token: req.params.resetGUID });
    if (!resetToken) {
        return res.status(400).send({
            message: 'Token not found may be expired'
        });
    }

    let user = await User.findOne({ _id: resetToken.userId });
    if (!user) {
        return res.status(400).send({
            message: 'No user found with such reset token'
        });
    }

    user.password = req.body.password;

    await user.hashPassword();

    return res.status(200).send({
        message: 'Password has been changed'
    });

};

exports.putUpdateProfile = async (req, res, next) => {
    if (validationHandle(req, res)) return;

    let result = await User.findByIdAndUpdate(req.user._id, _.pick(req.body, ['username', 'email', 'password', 'birthdate', 'gender', 'bio', 'country', 'city']));

    if (!result) {
        return res.status(400).send({
            message: 'Updating failed'
        });
    }

    if (req.body.password) {
        await user.hashPassword();
    }

    return res.status(200).send({
        message: 'Your profile has been updated'
    });
}

exports.deleteProfile = async (req, res, next) => {
    let result = await User.findByIdAndDelete(req.user._id);

    if (!result) return res.status(400).send({
        message: 'Something went wrong'
    });

    return res.status(200).send('Your account has been deleted');
};

exports.getViewProfile = async (req, res, next) => {
    if (!req.params.uid) return res.status(200).send(req.user);

    let user = await User.findById(req.params.uid).select('-__v');
    if (!user) return res.status(400).send({
        message: 'User has not been found'
    });

    res.status(200).send({ user });
};

exports.getSearchUsers = async (req, res, next) => {
    const phrase = req.query.phrase;
    let result = await User.find(
        { '$text': { '$search': phrase }, visible: true },
        { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .select('-__v -email -incomingFriendsRequests -sentFriendsRequests');

    res.send(result);
};
