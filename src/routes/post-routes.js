const express = require("express");
const router = express.Router();
const postsController = require("../controllers/post-controller.js");

router.get("/:postId", postsController.getPostById);
router.get("/user/:userId", postsController.getPostsByUserId);
router.get("/type/:type", postsController.getPostsByType)
router.get("/", postsController.getPosts);
router.delete("/:postId", postsController.deletePostById);
router.post("/", postsController.createPost);
router.patch("/:postId", postsController.editPost);

module.exports = router;


