const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config/dbConfig');

const { Strategy, ExtractJwt } = require('passport-jwt');
const userRouter = require('./routes/user');

const app = express();
app.use(bodyParser.json());
app.use(passport.initialize());
app.use('/user', userRouter);

mongoose
    .connect(config.url, config.options)
    .then(() => app.listen(9092))
    .catch(err => console.log(err));