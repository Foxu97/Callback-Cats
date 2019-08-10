const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config/dbConfig');
const User = require('./models/user');

const { Strategy, ExtractJwt } = require('passport-jwt');
const userRouter = require('./routes/user');

const app = express();
app.use(bodyParser.json());
app.use(passport.initialize());
app.use('/user', userRouter);

mongoose
    .connect(config.url, config.options)
    .then(() => {
        User.find({ role: 'admin' }).then(result => {
            if (result.length === 0) {
                new User({ email: 'admin@gmail.com', password: 'admin123', birthdate: '2019-01-01', gender: 'male', role: 'admin' }).save();
                console.log('Created DB and default admin');
            }
        });
        app.listen(9092, () => console.log('Web server listening on port 9092.'));
    })
    .catch(err => console.log(err));