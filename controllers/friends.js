const User = require('../models/user');
const sendMail = require('../utils/sendMail');

exports.addFriend = async (req, res, next) => {
    let requestedUser = await User.findOne({ username: req.body.username });

    if (!requestedUser) {
        return res.status(404).send("User not found");
    }
    if (req.user.incomingFriendsRequests.indexOf(requestedUser._id) > -1) {
        await addUsersToFriends(req.user, requestedUser);
        return res.status(200).send("You had a incoming request form this user, now you are friends");
    }
    if (requestedUser._id.equals(req.user._id)) {
        return res.status(400).send("You cant add yourself to friends");
    }
    if (requestedUser.incomingFriendsRequests.indexOf(req.user._id) > -1) {
        return res.status(400).send("You cant add yourself to friends");
    }
    if (requestedUser.friendsList.indexOf(req.user._id) > -1) {
        return res.status(400).send("You are already friends");
    }
    requestedUser.incomingFriendsRequests.push(req.user._id);
    await requestedUser.save();

    let user = await User.findOne({ _id: req.user._id });
    user.sentFriendsRequests.push(requestedUser._id);
    await user.save();
    sendMail("You have new friends request!", requestedUser.email);
    res.status(200).send("Sended friend request");
}
exports.acceptFirendsRequest = async (req, res, next) => {
    try {
        let user = await User.findOne({ username: req.body.username });

        if (!user) {
            return res.status(401).send("No user fetched");
        }
        if (req.user.incomingFriendsRequests.indexOf(user._id) === -1) {
            return res.status(400).send("You havent got invitation from this user");
        }
        await addUsersToFriends(req.user, user);
        res.status(201).send("You are friends now");

    }
    catch (err) {
        res.status(500).send("Something went wrong");
    }
}




exports.getFriendsList = async (req, res, next) => {
    if (req.user.friendsList.length === 0) {
        return res.status(200).send("You havent got any friends");
    }
    let fetchedFriendsList = await User.findOne({ _id: req.user.id })
        .populate('friendsList');
    // const friends = [];
    // fetchedFriendsList.friendsList.forEach(friend => {
    //     friends.push(friend.username);
    // })
    res.send(fetchedFriendsList.friendsList);
}
exports.getIncomingRequests = async (req, res, next) => {
    if (req.user.incomingFriendsRequests.length === 0) {
        return res.status(200).send("You havent got any incoming requests");
    }
    let fetchedIncomingList = await User.findOne({ _id: req.user.id })
        .populate('incomingFriendsRequests');
    const incomingRequests = [];
    fetchedIncomingList.incomingFriendsRequests.forEach(user => {
        incomingRequests.push(user.username);
    });
    res.send(incomingRequests);
}
exports.getSentRequests = async (req, res, next) => {
    if (req.user.sentFriendsRequests.length === 0) {
        return res.status(200).send("You havent got any outcoming requests");
    }
    let fetchedSentList = await User.findOne({ _id: req.user.id })
        .populate('sentFriendsRequests');
    const sentRequests = [];
    fetchedSentList.sentFriendsRequests.forEach(user => {
        sentRequests.push(user.username);
    });
    res.send(sentRequests);
}

exports.deleteFriend = async (req, res, next) => {
    try {
        let userToDelete = await User.findOne({ username: req.body.username });
        if (!userToDelete) {
            return res.status(404).send("User not found");
        }
        let UserToDeleteIndex = req.user.friendsList.indexOf(userToDelete._id);
        if (UserToDeleteIndex > -1) {
            req.user.friendsList.splice(UserToDeleteIndex, 1);
            await req.user.save();
            let userIndex = userToDelete.friendsList.indexOf(req.user._id);
            if (userIndex > -1) {
                userToDelete.friendsList.splice(userIndex, 1);
                await userToDelete.save();
            }
        }
        else {
            return res.status(400).send("This user is not your friend");
        }
    }
    catch (err) {
        res.status(500).send("Something went wrong");
    }

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
                let index = user.sentFriendsRequests.indexOf(requestingUser._id)
                if (index > -1) {
                    user.sentFriendsRequests.splice(index, 1);
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


// for development only !!
exports.clearArrays = (req, res, next) => {
    User.find()
        .then(users => {
            users.forEach(user => {
                user.friendsList = []
                user.incomingFriendsRequests = []
                user.sentFriendsRequests = []
                user.save();
            })
            res.status(200).send("all arrays clear now");
        });
}
//////////////////////////////////////////////////////////

