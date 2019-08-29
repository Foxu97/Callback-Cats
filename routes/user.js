const router = require('express').Router();
const userController = require('../controllers/user');
const passport = require('passport');
const validation = require('../middleware/validator');

router.post('/register', validation.registrationValidation, userController.postRegisterUser);

router.post('/signin', userController.postUserSignIn);

router.get('/activation/:activationGUID', userController.getAccountActivation);

router.post('/forgot', userController.postForgotPassword);

router.post('/reset/:resetGUID', validation.resetValidation, userController.postResetPassword);

//USER CRUD 

//user can update his profile
router.put('/update', passport.authenticate('jwt', { session: false }), validation.updateValidation, userController.putUpdateProfile);

//user can delete his profile
router.delete('/delete', passport.authenticate('jwt', { session: false }), userController.deleteProfile);

//user can view his profile
router.get('/profile', passport.authenticate('jwt', { session: false }), userController.getViewProfile);

//user can view other's profiles
router.get('/profile/:uid', passport.authenticate('jwt', { session: false }), userController.getViewProfile);

//user can search for other users
router.get('/search', passport.authenticate('jwt', { session: false }), userController.getSearchUsers);

module.exports = router;