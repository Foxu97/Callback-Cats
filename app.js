const express = require('express');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

const passportConfig = require('./config/passportConfig');
const config = require('./config/dbConfig');
const initAdmin = require('./utils/initAdmin').initAdmin;
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const adminRoutes = require('./routes/admin');
const friendsRouter = require('./routes/friends');
const adminAuth = require('./middleware/adminAuth').adminAuth;

const app = express();

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(express.static('public'))

app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/friends', passport.authenticate('jwt', { session: false }), friendsRouter);
app.use('/post', passport.authenticate('jwt', { session: false }), postRouter);
app.use('/admin', passport.authenticate('jwt', { session: false }), adminAuth, adminRoutes);

mongoose
    .connect(config.url, config.options)
    .then(() => {
        return initAdmin();
    })
    .then(() => {
        app.listen(9092, () => console.log('Web server listening on port 9092.'));
    })
    .catch(err => console.log(err));