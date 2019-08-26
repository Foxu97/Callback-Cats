const Post = require('../models/post');
const { validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");

exports.postAddPost = (req, res, next) => {
    const loggedID = jwt.decode(req.get('Authorization').slice(4)).id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send(errors);
    }
    req.body.createdBy = loggedID;
    let newPost = new Post(req.body);
    newPost.save()
        .then(() => {
            res.status(200).send('Post has been added');
        });
};

exports.getViewMyPosts = (req, res, next) => {
    const loggedID = jwt.decode(req.get('Authorization').slice(4)).id;
    Post.find({ createdBy: loggedID })
        .then(posts => {
            res.status(200).send(posts);
        });
};

exports.getViewPost = (req, res, next) => {
    const postID = req.params.id;
    Post.findById(postID)
        .then(post => {
            res.status(200).send(post);
        });
};

exports.putUpdatePost = (req, res, next) => {
    const postID = req.params.id;
    const loggedID = jwt.decode(req.get('Authorization').slice(4)).id;
    Post.updateOne({ _id: postID, createdBy: loggedID }, req.body)
        .then((docs) => {
            if (docs.n === 0) {
                return res.status(400).send('No posts found');
            }
            res.status(200).send('Post updated');
        });
};

exports.deletePost = (req, res, next) => {
    const postID = req.params.id;
    const loggedID = jwt.decode(req.get('Authorization').slice(4)).id;
    Post.deleteOne({ _id: postID, createdBy: loggedID })
        .then((docs) => {
            if (docs.n === 0) {
                return res.status(400).send('No posts found');
            }
            res.status(200).send('Post deleted');
        });
};

exports.getPublishPost = (req, res, next) => {
    const postID = req.params.id;
    const loggedID = jwt.decode(req.get('Authorization').slice(4)).id;
    Post.findOne({ _id: postID, createdBy: loggedID })
        .then((post) => {
            post.state = 'published';
            post.save()
                .then(() => {
                    res.status(200).send('Post published');
                });
        });
};

exports.searchPosts = (req, res, next) => {
    // first it should be checked if they are friends but not implemented yet
    if (req.body.searchBy.toLowerCase() === "tag") {
        Post.find({ state: "published", tags: req.body.searchedPhrase })
            .then((fetchedPosts) => {
                if (fetchedPosts.length === 0) {
                    return res.status(404).send("No post fetched");
                }
                res.status(200).json(fetchedPosts);
            })
            .catch(err => {
                res.status(404).send("Something went wrong");
                console.log(err);
            });
    }
    else if (req.body.searchBy.toLowerCase() === "title") {
        Post.find({ state: "published", title: { "$regex": req.body.searchedPhrase, "$options": "i" } })
            .then((fetchedPosts) => {
                if (fetchedPosts.length === 0) {
                    return res.status(404).send("No post fetched");
                }
                res.status(200).json(fetchedPosts);
            })
            .catch(err => {
                res.status(404).send("Something went wrong");
                console.log(err);
            });
    }
    else if (req.body.searchBy.toLowerCase() === "description") {
        Post.find({ state: "published", description: { "$regex": req.body.searchedPhrase, "$options": "i" } })
            .then((fetchedPosts) => {
                if (fetchedPosts.length === 0) {
                    return res.status(404).send("No post fetched");
                }
                res.status(200).json(fetchedPosts);
            })
            .catch(err => {
                res.status(404).send("Something went wrong");
                console.log(err);
            });
    }
}
