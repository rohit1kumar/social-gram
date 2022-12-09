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
const { isAuthenticated } = require("../middlewares/auth"); // Middleware to check if user is authenticated

const { uploadToServer } = require("../utils/upload");  //uploading image to server


router
  .route("/post/upload")
  .post(isAuthenticated, uploadToServer.single('image'), createPost); //uploading image to server and creating post

router
  .route("/post/:id")
  .post(isAuthenticated, likeAndUnlikePost) // liking and unliking post
  .delete(isAuthenticated, deletePost); // deleting post

router
  .route("/posts")
  .get(isAuthenticated, getPostOfFollowing);//  getting posts of following

router
  .route("/post/comment/:id")
  .post(isAuthenticated, commentOnPost) // commenting on post
  .delete(isAuthenticated, deleteComment);   // deleting comment


module.exports = router;
