const express = require("express");
const router = express.Router();

const { createComment } = require("../controllers/commentController");
const { createPost, getAllPosts } = require("../controllers/postController");
const { likePost, unlikePost } = require("../controllers/likeController");

router.post("/comments", createComment);

router.post("/likes/like", likePost);
router.post("/likes/unlikePost", unlikePost);

router.post("/posts", createPost);
router.get("/all/posts", getAllPosts);

module.exports = router;
