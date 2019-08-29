const router = require('express').Router();
const friendsController = require('../controllers/friends');

router.put('/acceptFriendsRequest', friendsController.acceptFirendsRequest);

router.get('/friendsList', friendsController.getFriendsList);

router.get('/incomingRequests', friendsController.getIncomingRequests);

router.get('/outcomingRequests', friendsController.getOutcomingRequests);

router.put('/deleteFriend', friendsController.deleteFriend)

router.put('/addFriend', friendsController.addFriend);
//for development only
router.get('/clearArrays', friendsController.clearArrays);
//

module.exports = router;