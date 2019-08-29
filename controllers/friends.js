const User = require('../models/user');
const sendMail = require('../utils/sendMail');

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

