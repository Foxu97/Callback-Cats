const router = require('express').Router();
const adminController = require('../controllers/admin');

router.put('/user/update', adminController.putUserUpdate);

router.delete('/user/delete', adminController.deleteUserProfile);

module.exports = router;