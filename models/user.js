const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: { type: String },
    name: { type: String },
    surname: { type: String },
    email: { type: String },
    password: {
        type: String,
        select: false
    },
    birthdate: { type: Date },
    gender: { type: String },
    role: {
        type: String,
        default: 'user'
    },
    activationGUID: {
        type: String,
        select: false
    },
    active: {
        type: Boolean,
        default: false,
        select: false
    },
    bio: { type: String },
    country: { type: String },
    city: { type: String },
    friendsList: { type: Array },
    incomingFriendsRequests: { type: Array },
    outcomingFriendsRequests: { type: Array },
    visible: {
        type: Boolean,
        default: true,
        select: false
    }
});

userSchema.index({
    'username': 'text',
    'city': 'text',
    'country': 'text'
});

userSchema.methods.hashPassword = async function () {
    let hash = await bcrypt.hash(this.password, 12);
    this.password = hash;
    await this.save();
};

const User = model('User', userSchema);

module.exports = User;