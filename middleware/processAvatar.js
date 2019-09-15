const sharp = require('sharp')
const path = require('path');
const mime = require('mime')

const processAvatar = (req, res, next) => {
    req.file.filename = 'avatar' + '-' + Date.now() + '-' + req.user._id + '.jpeg';
    sharp(req.file.buffer)
        .resize(175, undefined)
        .toFile(path.join(__dirname, '..', 'public/users', req.file.filename));
    next();
}

module.exports = processAvatar;