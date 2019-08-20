const router = require('express').Router();
const userController = require('../controllers/user');
const validator = require('../middleware/validator');
const passport = require('passport');

router.post('/register', validator.registrationValidation, userController.postRegisterUser);

router.post('/signin', userController.postUserSignIn);

router.get('/activation/:activationGUID', userController.getAccountActivation);

router.post('/forgot', userController.postForgotPassword);

router.post('/reset/:resetGUID', validator.resetValidation, userController.postResetPassword);

//USER CRUD 

router.put('/update', passport.authenticate('jwt', { session: false }), userController.putUpdateProfile);

router.delete('/delete', passport.authenticate('jwt', { session: false }), userController.deleteProfile);


module.exports = router;