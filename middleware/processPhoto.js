const sharp = require('sharp')
const path = require('path');
const mime = require('mime')

const processAvatar = (req, res, next) => {
    req.file.filename = 'photo' + '-' + Date.now() + '-' + req.user._id + '.jpeg';
    sharp(req.file.buffer)
        .resize(400)
        .toFile(path.join(__dirname, '..', 'public/posts', req.file.filename));
    next();
}

module.exports = processAvatar;