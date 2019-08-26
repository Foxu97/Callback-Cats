const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new Schema({
    email: { type: String },
    password: { type: String },
    birthdate: { type: Date },
    gender: { type: String, },
    role: { type: String, },
    activationGUID: { type: String, },
    active: { type: Boolean, },
    bio: { type: String },
    country: { type: String },
    city: { type: String },
    color: { type: String }
});

userSchema.methods.hashPassword = function () {
    return bcrypt.hash(this.password, 12)
        .then(hash => {
            this.password = hash;
            return this.save();
        });
};

const User = model('User', userSchema);

module.exports = User;