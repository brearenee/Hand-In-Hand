const express = require('express');
const router = express.Router();
const postsController = require('../controllers/post-controller.js')

router.get('/:postId', postsController.getPostById);
router.get('/user/:userId', postsController.getPostsByUserId);
router.get('/', postsController.getPosts);
router.delete('/:postId', postsController.deletePostById);
router.post('/', postsController.createPost)

module.exports = router;
<<<<<<< HEAD


=======
>>>>>>> bc3e049 (swagger documentation in full force)
