const express = require("express");
const router = express.Router();
const {
  createPost,
  likeAndUnlikePost,
  deletePost,
  getPostOfFollowing,
  commentOnPost,
  deleteComment,
} = require("../controllers/post");
const { isAuthenticated } = require("../middlewares/auth");

const { uploadToServer } = require('../utils/upload');


router.route("/post/upload").post(isAuthenticated, uploadToServer.single('image'), createPost);

router
  .route("/post/:id")
  .post(isAuthenticated, likeAndUnlikePost)
  .delete(isAuthenticated, deletePost);

router.route("/posts").get(isAuthenticated, getPostOfFollowing);

router
  .route("/post/comment/:id")
  .put(isAuthenticated, commentOnPost)
  .delete(isAuthenticated, deleteComment);

module.exports = router;
