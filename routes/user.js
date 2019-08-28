const router = require('express').Router();
const userController = require('../controllers/user');
const passport = require('passport');
const validation = require('../middleware/validator');

router.post('/register', validation.registrationValidation, userController.postRegisterUser);

router.post('/signin', userController.postUserSignIn);

router.get('/activation/:activationGUID', userController.getAccountActivation);

router.post('/forgot', userController.postForgotPassword);

router.post('/reset/:resetGUID', userController.postResetPassword);

//USER CRUD 

//for development only
router.get('/clearArrays', userController.clearArrays);
//

router.put('/update', passport.authenticate('jwt', { session: false }), validation.updateValidation, userController.putUpdateProfile);

router.delete('/delete', passport.authenticate('jwt', { session: false }), userController.deleteProfile);

router.put('/addFriend', passport.authenticate('jwt', { session: false }), userController.addFriend);

router.put('/acceptFriendsRequest', passport.authenticate('jwt', { session: false }), userController.acceptFirendsRequest);

router.get('/friendsList', passport.authenticate('jwt', { session: false }), userController.getFriendsList);

router.get('/incomingRequests', passport.authenticate('jwt', { session: false }), userController.getIncomingRequests);

router.get('/outcomingRequests', passport.authenticate('jwt', { session: false }), userController.getOutcomingRequests);

router.put('/deleteFriend', passport.authenticate('jwt', { session: false }), userController.deleteFriend)


module.exports = router;