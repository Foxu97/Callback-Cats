const { ExtractJwt } = require('passport-jwt');

exports.options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: process.env.PASSPORT_SECRET
};