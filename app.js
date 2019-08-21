const express = require('express');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config/dbConfig');
const User = require('./models/user');
const initAdmin = require('./utils/initAdmin').initAdmin;
const passportOptions = require('./config/passportConfig').options;

const { Strategy } = require('passport-jwt');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');

const app = express();

app.use(bodyParser.json());

app.use(passport.initialize());

app.use('/user', userRouter);

passport.use(new Strategy(passportOptions, function (jwt_payload, done) {
    User.findById(jwt_payload.id, function (err, user) {
        if (err) {
            return done(err, false);
        } if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));

app.use('/post', passport.authenticate('jwt', { session: false }), postRouter);

mongoose
    .connect(config.url, config.options)
    .then(() => {
        return initAdmin();
    })
    .then(() => {
        app.listen(9092, () => console.log('Web server listening on port 9092.'));
    })
    .catch(err => console.log(err));