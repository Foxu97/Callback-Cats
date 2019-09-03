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
    let result = await Post.find({
        $and: [
            { _id: req.params.id },
            {
                $or: [
                    { createdBy: req.user._id },
                    { state: 'published', privacyLevel: 'public' },
                    { privacyLevel: 'friendsOnly', state: 'published', createdBy: { $in: req.user.friendsList } }
                ]
            }]
    });

    if (result.length === 0) res.status(400).send({
        message: 'No post has been found or you have no permission to view it'
    });

    res.status(200).send({
        post: result
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

exports.searchPosts = async (req, res, next) => {
    const phrase = req.query.phrase;
    let result = await Post.find({
        $and: [
            { '$text': { '$search': phrase } },
            {
                $or: [
                    { createdBy: req.user._id },
                    { state: 'published', privacyLevel: 'public' },
                    { privacyLevel: 'friendsOnly', state: 'published', createdBy: { $in: req.user.friendsList } }
                ]
            }]
    });

    if (result.length === 0) return res.status(400).send({
        message: 'No posts found'
    });

    res.send({
        posts: result
    });
};

exports.getAllPosts = async (req, res, next) => {
    let result = await Post.find({
        $or: [
            { createdBy: req.user._id },
            { state: 'published', privacyLevel: 'public' },
            { privacyLevel: 'friendsOnly', state: 'published', createdBy: { $in: req.user.friendsList } }
        ]
    });

    if (result.length === 0) return res.status(400).send({
        message: 'No posts found'
    });

    res.send({
        posts: result
    });
};