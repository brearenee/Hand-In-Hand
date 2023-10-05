const express = require('express');
const router = express.Router();
const postsController = require('../controllers/post-controller.js')
//const jsonParser = express.json()
//const bodyParser = require('body-parser');
//app.use(bodyParser.json());

router.get('/:postId', postsController.getPostById);
router.get('/user/:userId', postsController.getPostsByUserId);
router.get('/', postsController.getPosts);
router.delete('/:postId', postsController.deletePostById);
router.post('/', postsController.createPost)

module.exports = router;