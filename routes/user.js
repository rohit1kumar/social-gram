const express = require("express");
const router = express.Router();
const {
  register,
  login,
  followUser,
  logout,
  updatePassword,
  updateProfile,
  myProfile,
  getUserProfile,
  getAllUsers,
  getMyPosts,
  getUserPosts,
} = require("../controllers/user");

const { uploadToServer } = require('../utils/upload'); //uploading image to server
const { isAuthenticated } = require("../middlewares/auth"); // Middleware to check if user is authenticated


router.route("/register").post(uploadToServer.single('avatar'), register); //registering user and uploading image to server

router.route("/login").post(login); //logging in user

router.route("/logout").get(logout);  //  logging out user

router.route("/follow/:id").get(isAuthenticated, followUser);   //  following user

router.route("/update/password").put(isAuthenticated, updatePassword);  //  updating password

router.route("/update/profile").put(isAuthenticated, uploadToServer.single('avatar'), updateProfile); //  updating profile

router.route("/me").get(isAuthenticated, myProfile); // getting my profile

router.route("/my/posts").get(isAuthenticated, getMyPosts); //  getting my posts

router.route("/userposts/:id").get(isAuthenticated, getUserPosts);  //  getting user posts

router.route("/user/:id").get(isAuthenticated, getUserProfile); //  getting user profile

router.route("/users").get(isAuthenticated, getAllUsers); //  getting all users by name query params

module.exports = router;  
