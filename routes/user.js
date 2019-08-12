const router = require('express').Router();
const userController = require('../controllers/user');
const { body } = require('express-validator');
const User = require('../models/user');

// required email, password, gender, birthdate
// optional bio, country, city, color
router.post('/register', [
    body('password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$!#%*?&]{8,}$/).withMessage('Passowrd has to contain at least 1 special character, 1 number, 1 lower and 1 upper case character and be of lenght of not lower than 8'),
    body('email').normalizeEmail().isEmail().withMessage('Please provide a proper e-mail adress'),
    body('email').custom(value => {
        return User.findByEmail(value).then(user => {
            if (user) {
                return Promise.reject('E-mail is in use');
            }
        });
    }),
    body('gender').isIn(['male', 'female']),
    body('birthdate').isISO8601().withMessage('Please provide a proper date in the ISO8601 format')
], userController.postRegisterUser);

router.post('/signin', userController.postUserSignIn);

router.get('/activation/:activationGUID', userController.getAccountActivation);



module.exports = router;