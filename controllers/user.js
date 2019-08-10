const validator = require('validator');
const { validationResult } = require('express-validator');
const User = require('../models/user');

exports.postRegisterUser = (req, res, next) => {
    // let { email, password, gender, birthdate } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send(errors);
    }
    //console.log(User.findByEmail('asd@gmail.com'));
    res.status(200).send('git');
};