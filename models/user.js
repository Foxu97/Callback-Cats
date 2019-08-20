const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    email: {
        required: true,
        type: String,
    },
    password: {
        required: true,
        type: String
    },
    birthdate: {
        required: true,
        type: Date
    },
    gender: {
        required: true,
        type: String,
        enum: ['male', 'female']
    },
    role: {
        type: String,
        enum: ['admin', 'moderator', 'user'],
        default: 'user'
    },
    activationGUID: {
        type: String,
        required: false
    },
    active: {
        type: Boolean,
        default: false
    },
    bio: {
        type: String
    },
    country: {
        type: String
    },
    city: {
        type: String
    },
    color: {
        type: String
    }
});

userSchema.methods.hashPassword = function () {
    return bcrypt.hash(this.password, 12)
        .then(hash => {
            this.password = hash;
            this.save();
        })
        .catch(err => {
            console.log(err);
        });
};

const User = model('User', userSchema);

module.exports = User;