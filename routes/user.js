const router = require('express').Router();
const userController = require('../controllers/user');
const passport = require('passport');
const validation = require('../middleware/validator');
const uploadPhoto = require('../middleware/uploadPhoto');
const processAvatar = require('../middleware/processAvatar');

router.post('/register', validation.registrationValidation, userController.postRegisterUser);

router.get('/activation/:activationGUID', userController.getAccountActivation);

router.post('/signin', userController.postUserSignIn);

router.post('/forgot', userController.postForgotPassword);

router.post('/reset/:resetGUID', validation.resetValidation, userController.postResetPassword);

router.put('/update', passport.authenticate('jwt', { session: false }), validation.updateValidation, userController.putUpdateProfile);

router.put('/setAvatar', passport.authenticate('jwt', { session: false }), uploadPhoto, processAvatar, userController.putSetAvatar);

router.delete('/delete', passport.authenticate('jwt', { session: false }), userController.deleteProfile);

router.get('/profile', passport.authenticate('jwt', { session: false }), userController.getViewProfile);

router.get('/profile/:uid', passport.authenticate('jwt', { session: false }), userController.getViewProfile);

router.get('/search', passport.authenticate('jwt', { session: false }), userController.getSearchUsers);

module.exports = router;