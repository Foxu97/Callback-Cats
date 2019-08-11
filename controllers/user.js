const validator = require('validator');
const { validationResult } = require('express-validator');
const User = require('../models/user');

exports.postRegisterUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send(errors);
    }
    User.create(req.body);
    res.status(200).send('git');
};