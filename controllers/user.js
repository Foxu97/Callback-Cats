const User = require('../models/user');
const ResetToken = require('../models/resetToken');
const sendMail = require('../utils/sendMail');
const validationHandle = require('../utils/validationHandle');

const uuidv1 = require('uuid/v1');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const _ = require('lodash');


exports.postRegisterUser = async (req, res, next) => {
    if (validationHandle(req, res)) return;

    let user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        activationGUID: uuidv1(),
        birthdate: req.body.birthdate,
        gender: req.body.gender,
        role: req.body.role,
        bio: req.body.bio,
        country: req.body.country,
        city: req.body.city
    });

    await user.hashPassword();

    const activationLink = 'http://localhost:9092/user/activation/' + user.activationGUID;
    sendMail(activationLink, user.email);
    res.status(200).send('User created successfuly ' + activationLink);
};

exports.getAccountActivation = async (req, res, next) => {
    let user = await User.findOne({ activationGUID: req.params.activationGUID });
    if (!user) return res.status(400).send({
        message: 'No user with that activation ID found'
    });

    user.activationGUID = undefined;
    user.active = true;
    await user.save();
    res.status(200).send({
        message: 'Account has been activated'
    });
};

exports.postUserSignIn = async (req, res, next) => {
    let user = await User.findOne({ email: req.body.email }).select('+active +password');
    if (!user) return res.status(400).send({
        message: 'Invalid credentials'
    });

    if (!user.active) return res.status(400).send({
        message: 'Account has not been yet activated'
    });

    let result = await bcrypt.compare(req.body.password, user.password);
    if (!result) return res.status(400).send({
        message: 'Authentication failed'
    });

    return res.status(200).send({
        message: 'User has been logged in',
        jwt: jwt.sign({
            id: user._id
        }, process.env.PASSPORT_SECRET, { expiresIn: "1h" })
    });

};

exports.postForgotPassword = async (req, res, next) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send({
            message: 'No e-mail found in the database'
        });
    }

    let resetToken = new ResetToken({ userId: user._id, token: uuidv1() });
    await resetToken.save();
    let resetLink = 'http://localhost:9092/user/reset/' + resetToken.token;
    sendMail(resetLink, user.email);
    return res.status(200).send({
        message: 'Password reset link has been sent on provided mail ' + resetLink
    });
};

exports.postResetPassword = async (req, res, next) => {
    if (validationHandle(req, res)) return;

    let resetToken = await ResetToken.findOne({ token: req.params.resetGUID });
    if (!resetToken) {
        return res.status(400).send({
            message: 'Token not found may be expired'
        });
    }

    let user = await User.findOne({ _id: resetToken.userId });
    if (!user) {
        return res.status(400).send({
            message: 'No user found with such reset token'
        });
    }

    user.password = req.body.password;

    await user.hashPassword();

    return res.status(200).send({
        message: 'Password has been changed'
    });


};

exports.putUpdateProfile = async (req, res, next) => {
    if (validationHandle(req, res)) return;

    let result = await User.findByIdAndUpdate(req.user._id, _.pick(req.body, ['username', 'email', 'password', 'birthdate', 'gender', 'bio', 'country', 'city']));

    if (!result) {
        return res.status(400).send({
            message: 'Updating failed'
        });
    }

    if (req.body.password) {
        await user.hashPassword();
    }

    return res.status(200).send({
        message: 'Your profile has been updated'
    });
}



exports.addFriend = (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then(requestedUser => {
            if (!requestedUser) {
                throw new Error("User not found");
            }
            if (req.user.incomingFriendsRequests.indexOf(requestedUser._id) > -1) {
                addUsersToFriends(req.user, requestedUser) //rocket engineering ? 
                throw new Error("You had a incoming request form this user, now you are friends"); //error codes to change
            }
            if (requestedUser._id.equals(req.user._id)) {
                throw new Error("You cant add yourself to friends");
            }
            if (requestedUser.incomingFriendsRequests.indexOf(req.user._id) > -1) {
                throw new Error("Request already sended, you have to wait until user approve your request");
            }
            if (requestedUser.friendsList.indexOf(req.user._id) > -1) {
                throw new Error("You are already friends");
            }
            requestedUser.incomingFriendsRequests.push(req.user._id);
            return requestedUser.save();
        })
        .then((requestedUser) => {
            return Promise.all([User.findOne({ _id: req.user._id }), requestedUser]);
        }
        )
        .then(([user, requestedUser]) => {
            user.outcomingFriendsRequests.push(requestedUser._id);
            return Promise.all([user.save(), requestedUser]);
        })
        .then(([savedUser, requestedUser]) => {
            sendMail("You have new friends request!", requestedUser.email);
            res.status(200).send("Sended friend request");
        })
        .catch(err => {
            console.log(err)
            res.status(404).send(err.message);
        })
}
exports.acceptFirendsRequest = (req, res, body) => {
    User.findOne({ username: req.body.username })
        .then((fetchedUser) => {
            if (!fetchedUser) {
                return res.status(401).send("No user fetched");
            }
            if (req.user.incomingFriendsRequests.indexOf(fetchedUser._id) === -1) {
                return res.status(400).send("You havent got invitation from this user");
            }
            addUsersToFriends(req.user, fetchedUser).then(
                res.status(201).send("You are friends now")
            )
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("Something went wrong");
        });

}

function addUsersToFriends(requestingUser, requestedUser) {
    return new Promise((resolve, reject) => {
        User.findById(requestingUser._id)
            .then(user => {
                let index = user.incomingFriendsRequests.indexOf(requestedUser._id);
                if (index > -1) {
                    user.incomingFriendsRequests.splice(index, 1);
                    user.friendsList.push(requestedUser._id);
                    sendMail("You have new friend!", user.email);
                    return user.save();
                }
            })
            .then(() => {
                return User.findById(requestedUser._id)
            })
            .then(user => {
                let index = user.outcomingFriendsRequests.indexOf(requestingUser._id)
                if (index > -1) {
                    user.outcomingFriendsRequests.splice(index, 1);
                    user.friendsList.push(requestingUser._id);
                    sendMail("You have new friend!", user.email);
                    return user.save();
                }
            })
            .then(() => {
                resolve();
            })
            .catch(err => {
                console.log(err);
                reject(err);
            })
    });
}

exports.getFriendsList = (req, res, next) => {
    if (req.user.friendsList.length === 0) {
        return res.status(200).send("You havent got any friends");
    }
    getUsersNamesArray(req.user.friendsList, res);
}
exports.getIncomingRequests = (req, res, next) => {
    if (req.user.incomingFriendsRequests.length === 0) {
        return res.status(200).send("You havent got any incoming requests");
    }
    getUsersNamesArray(req.user.incomingFriendsRequests, res);
}
exports.getOutcomingRequests = (req, res, next) => {
    if (req.user.outcomingFriendsRequests.length === 0) {
        return res.status(200).send("You havent got any outcoming requests");
    }
    getUsersNamesArray(req.user.outcomingFriendsRequests, res);
}

exports.deleteFriend = (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then(userToDelete => {
            if (!userToDelete) {
                throw new Error("No user fetched");
            }
            let index = req.user.friendsList.indexOf(userToDelete._id);
            if (index > -1) {
                req.user.friendsList.splice(index, 1);
                return req.user.save();
            }
            else {
                throw new Error("This user is not your friend");
            }
        })
        .then(() => {
            let index = userToDelete.friendsList.indexOf(req.user._id);
            if (index > -1) {
                userToDelete.friendsList.splice(index, 1);
                return userToDelete.save();
            }
        })
        .then(() => {
            res.status(201).send("User removed from friends list");
        })
        .catch(err => {
            res.status(400).send(err.message);
        });
}

async function getUsersNamesArray(array, res) {
    const users = [];
    for (const id of array) {
        let user = await User.findById(id);
        users.push(user.username);
    }
    res.status(200).json(users);
}

// for development only !!
exports.clearArrays = (req, res, next) => {
    User.find()
        .then(users => {
            users.forEach(user => {
                user.friendsList = []
                user.incomingFriendsRequests = []
                user.outcomingFriendsRequests = []
                user.save();
            })
            res.status(200).send("all arrays clear now");
        });
}
//////////////////////////////////////////////////////////
exports.addFriend = (req, res, next) => {
};

exports.deleteProfile = async (req, res, next) => {
    let result = await User.findByIdAndDelete(req.user._id);

    if (!result) return res.status(400).send({
        message: 'Something went wrong'
    });

    return res.status(200).send('Your account has been deleted');
};

exports.getViewProfile = async (req, res, next) => {
    if (!req.params.uid) return res.status(200).send(req.user);

    let user = await User.findById(req.params.uid).select('-__v');
    if (!user) return res.status(400).send({
        message: 'User has not been found'
    });

    res.status(200).send({ user });
};

exports.getSearchUsers = async (req, res, next) => {
    const phrase = req.query.phrase;
    console.log(phrase)
    let result = await User.find(
        { '$text': { '$search': phrase }, visible: true },
        { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .select('-__v -email');

    res.send(result);
};