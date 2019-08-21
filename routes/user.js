const router = require('express').Router();
const userController = require('../controllers/user');

// required email, password, gender, birthdate
// optional bio, country, city, color
router.post('/register', userController.postRegisterUser);

router.post('/signin', userController.postUserSignIn);

router.get('/activation/:activationGUID', userController.getAccountActivation);

router.post('/forgot', userController.postForgotPassword);

router.post('/reset/:resetGUID', userController.postResetPassword);

module.exports = router;