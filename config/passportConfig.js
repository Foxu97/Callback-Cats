const { ExtractJwt, Strategy } = require('passport-jwt');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const passport = require('passport');
const User = require('../models/user');
const FacebookStrategy = require('passport-facebook').Strategy;

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: process.env.PASSPORT_SECRET
};

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:9092/auth/facebook/callback'
}, async (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    // let result = await User.findOne({ facebookID: profile.id });
    // if (!result) {
    //     let newUser = new User({
    //         facebookID: profile.id,
    //         username: profile.displayName
    //     });
    //     await newUser.save();
    //     done(null, newUser);
    // } else {
    //     done(null, result);
    // }
}));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:9092/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    let result = await User.findOne({ googleID: profile.id });
    if (!result) {
        let newUser = new User({
            googleID: profile.id,
            username: profile.displayName
        });
        await newUser.save();
        done(null, newUser);
    } else {
        done(null, result);
    }
}));

passport.use(new Strategy(options, function (jwt_payload, done) {
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
