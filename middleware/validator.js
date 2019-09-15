const User = require('../models/user');
const { body, check } = require('express-validator');

exports.registrationValidation = [
    body('password')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$!#%*?&]{8,}$/)
        .withMessage('Passowrd has to contain at least 1 special character, 1 number, 1 lower and 1 upper case character and be of lenght of not lower than 8'),
    body('email')
        .normalizeEmail()
        .isEmail()
        .withMessage('Please provide a proper e-mail adress'),
    body('email')
        .custom(value => {
            return User.findOne({ email: value }).then(user => {
                if (user) {
                    return Promise.reject('E-mail is in use');
                }
            });
        }),
    body('username')
        .exists(),
    body('username')
        .custom(value => {
            return User.findOne({ username: value }).then(user => {
                if (user) {
                    return Promise.reject("This username is already in use");
                }
            });
        }),
    body('gender')
        .isIn(['male', 'female']),
    body('birthdate')
        .isISO8601()
        .withMessage('Please provide a proper date in the ISO8601 format')
];

exports.postValidation = [
    body('description')
        .exists(),
    body('title')
        .exists(),
    body('privacyLevel')
        .isIn(['public', 'friendsOnly', 'private']),
    body('tags')
        .custom(value => {
            return value.length < 11;
        })
        .withMessage('Too many tags, maximum number is 10')
];

exports.postUpdateValidation = [
    body('privacyLevel')
        .optional()
        .isIn(['public', 'friendsOnly', 'private']),
    body('tags')
        .optional()
        .custom(value => {
            return value.length < 11;
        })
        .withMessage('Too many tags, maximum number is 10')
];

exports.resetValidation = [
    body('password')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$!#%*?&]{8,}$/)
        .withMessage('Passowrd has to contain at least 1 special character, 1 number, 1 lower and 1 upper case character and be of lenght of not lower than 8')
];

exports.updateValidation = [
    body('password')
        .optional()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$!#%*?&]{8,}$/)
        .withMessage('Passowrd has to contain at least 1 special character, 1 number, 1 lower and 1 upper case character and be of lenght of not lower than 8'),
    body('email')
        .optional()
        .normalizeEmail()
        .isEmail()
        .withMessage('Please provide a proper e-mail adress'),
    body('email')
        .optional()
        .custom(value => {
            return User.findOne({ email: value }).then(user => {
                if (user) {
                    return Promise.reject('E-mail is in use');
                }
            });
        }),
    body('username')
        .optional()
        .custom(value => {
            return User.findOne({ username: value }).then(user => {
                if (user) {
                    return Promise.reject("This username is already in use");
                }
            });
        }),
    body('gender')
        .optional()
        .isIn(['male', 'female']),
    body('birthdate')
        .optional()
        .isISO8601()
        .withMessage('Please provide a proper date in the ISO8601 format')
];


