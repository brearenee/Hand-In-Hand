const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts-controller.js')

router.get('/:postId', postsController.getPostById);
router.get('/user/:userId', postsController.getPostsByUserId);
router.get('/', postsController.getPosts);

module.exports = router;