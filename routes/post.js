const router = require('express').Router();
const postController = require('../controllers/post');
const validator = require('../middleware/validator');
const uploadPhoto = require('../middleware/uploadPhoto');
const processPhoto = require('../middleware/processPhoto');

router.post('/add', uploadPhoto, processPhoto, validator.postValidation, postController.postAddPost);

router.get('/view', postController.getViewMyPosts);

router.get('/view/:id', postController.getViewPost);

router.put('/update/:id', validator.postUpdateValidation, postController.putUpdatePost);

router.delete('/delete/:id', postController.deletePost);

router.get('/publish/:id', postController.getPublishPost);

router.get('/search', postController.searchPosts);

router.get('/list', postController.getAllPosts);

module.exports = router;