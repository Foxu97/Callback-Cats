const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new Schema({
    email: {
        required: true,
        type: String,
        validate: [validator.isEmail, 'Not a proper e-mail'],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        required: true,
        type: String,
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$!#%*?&]{8,}$/,
            'Passowrd has to contain at least 1 special character, 1 number, 1 lower and 1 upper case character and be of lenght of not lower than 8'
        ]
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
            return this.save();
        });
};

const User = model('User', userSchema);

module.exports = User;