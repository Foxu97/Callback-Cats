const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

const { Strategy, ExtractJwt } = require('passport-jwt');


const app = express();
app.use(bodyParser.json());


app.use(passport.initialize());

mongoose
    .connect(config.database.url, config.database.options)
    .then(() => app.listen(config.server.port))
    .catch(err => console.log(err));