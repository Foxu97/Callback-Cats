const router = require('express').Router();
const userController = require('../controllers/user');

// required email, password, gender, birthdate
// optional bio, country, city, color
router.post('/register', userController.postRegisterUser);

module.exports = router;