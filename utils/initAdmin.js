const User = require('../models/user');

exports.initAdmin = () => {
    return User.find({ role: 'admin' })
        .then(result => {
            if (result.length === 0) {
                return new User({ email: 'admin@gmail.com', password: process.env.ADMIN_PASSWORD, birthdate: '2019-01-01', gender: 'male', role: 'admin' }).hashPassword();
            }
        })
        .then(() => {
            console.log('Created DB and default admin');
        });
}