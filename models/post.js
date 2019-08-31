const { Schema, model } = require('mongoose');

const postSchema = new Schema({
    description: { type: String, },
    title: { type: String, },
    // photo: {

    // },
    // file: {

    // },
    privacyLevel: {
        type: String,
        enum: ['public', 'friendsOnly', 'private'],
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
    tags: { type: [String] },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});
//buildurl, 
const Post = model('Post', postSchema);

module.exports = Post;