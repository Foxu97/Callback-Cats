const { Schema, model } = require('mongoose');

const postSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    // photo: {

    // },
    // file: {

    // },
    privacyLevel: {
        type: String,
        enum: ['public', 'friendsOnly', 'private'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    state: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    tags: {
        type: [String]
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Post = model('Post', postSchema);

module.exports = Post;