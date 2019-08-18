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
    newPost.save().then(() => {
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

exports.putUpdatePost = (req, res, next) => {

};