const Post = require('../models/post');
const jwt = require("jsonwebtoken");
const validationHandle = require('../utils/validationHandle');
const _ = require('lodash');

exports.postAddPost = async (req, res, next) => {
    if (validationHandle(req, res)) return;

    let newPost = new Post({
        title: req.body.title,
        description: req.body.description,
        privacyLevel: req.body.privacyLevel,
        tags: req.body.tags,
        createdBy: req.user._id
    });

    await newPost.save();

    res.status(200).send({
        message: 'Post has been added'
    });
};

exports.getViewMyPosts = async (req, res, next) => {
    let posts = await Post.find({ createdBy: req.user._id });

    res.status(200).send({
        posts
    });
};

exports.getViewPost = async (req, res, next) => {
    let post = await Post.findById(req.params.id);

    if (post.createdBy.equals(req.user._id)) return res.status(200).send({
        post
    });

    if (post.state === 'published') {
        if (post.privacyLevel === 'public') return res.status(200).send({
            post
        });

        if (post.privacyLevel === 'friendsOnly') {
            for (let friend of req.user.friendsList) {
                if (post.createdBy.equals(friend)) return res.status(200).send({
                    post
                });
            }
        }
    }

    res.status(400).send({
        message: 'Post has been not found or you have no permission to view it'
    });
};

exports.putUpdatePost = async (req, res, next) => {
    if (validationHandle(req, res)) return;

    let result = await Post.updateOne({ _id: req.params.id, createdBy: req.user._id },
        _.pick(req.body, ['title', 'description', 'privacyLevel', 'tags']));

    if (result.n === 0) return res.status(400).send({
        message: 'No post found or you have no permission to update it'
    });

    res.status(200).send({
        message: 'Post has been updated'
    });
};

exports.deletePost = async (req, res, next) => {
    let result = await Post.deleteOne({ _id: req.params.id, createdBy: req.body._id });

    if (result.n === 0) return res.status(400).send({
        message: 'No post found or you have no permission to delete it'
    });

    res.status(200).send({
        message: 'Post has been deleted'
    });
};

exports.getPublishPost = async (req, res, next) => {
    let result = await Post.findByIdAndUpdate({ _id: req.params.id, createdBy: req.user.id }, { state: 'published' });

    if (!result) return res.status(400).send({
        message: 'No post has been found or you have no permission to publish it'
    });

    res.status(200).send('Post published');
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
