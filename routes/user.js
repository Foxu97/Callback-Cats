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

//for development only
router.get('/clearArrays', userController.clearArrays);
//

//user can update his profile
router.put('/update', passport.authenticate('jwt', { session: false }), validation.updateValidation, userController.putUpdateProfile);

//user can delete his profile
router.delete('/delete', passport.authenticate('jwt', { session: false }), userController.deleteProfile);

//user can view his profile
router.get('/profile', passport.authenticate('jwt', { session: false }), userController.getViewProfile);
router.put('/addFriend', passport.authenticate('jwt', { session: false }), userController.addFriend);

//user can view other's profiles
router.get('/profile/:uid', passport.authenticate('jwt', { session: false }), userController.getViewProfile);

//user can search for other users
router.get('/search', passport.authenticate('jwt', { session: false }), userController.getSearchUsers);
router.put('/acceptFriendsRequest', passport.authenticate('jwt', { session: false }), userController.acceptFirendsRequest);

router.get('/friendsList', passport.authenticate('jwt', { session: false }), userController.getFriendsList);

router.get('/incomingRequests', passport.authenticate('jwt', { session: false }), userController.getIncomingRequests);

router.get('/outcomingRequests', passport.authenticate('jwt', { session: false }), userController.getOutcomingRequests);

router.put('/deleteFriend', passport.authenticate('jwt', { session: false }), userController.deleteFriend)


module.exports = router;