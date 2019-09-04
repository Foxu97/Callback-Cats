const passport = require('passport');
const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.get('/google', passport.authenticate('google', { scope: ['profile'], session: false }));

router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
    res.send({
        message: 'User has been logged in',
        jwt: jwt.sign({
            id: req.user._id
        }, process.env.PASSPORT_SECRET, { expiresIn: "1h" })
    });
});

router.get('/facebook', passport.authenticate('facebook', { session: false }));

router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), (req, res) => {
    res.send({
        message: 'User has been logged in',
        jwt: jwt.sign({
            id: req.user._id
        }, process.env.PASSPORT_SECRET, { expiresIn: "1h" })
    });
});

module.exports = router;