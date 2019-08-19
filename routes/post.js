const router = require('express').Router();
const postController = require('../controllers/post');
const validator = require('../middleware/validator');

router.post('/add', validator.postValidation, postController.postAddPost);

//display all posts posted by currently logged in user
router.get('/view', postController.getViewMyPosts);

router.get('/view/:id', postController.getViewPost);

router.put('/update/:id', postController.putUpdatePost);

router.delete('/delete/:id', postController.deletePost);

router.get('/publish/:id', postController.getPublishPost);

module.exports = router;