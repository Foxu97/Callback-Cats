const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    email: {
        required: true,
        type: String
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

userSchema.statics.findByEmail = (email) => {
    return User.findOne({ email: email }, (result) => {
        if (!result) {
            return false;
        }
        return true;
    });
};

const User = model('User', userSchema);

module.exports = User;
