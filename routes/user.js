const express = require("express");
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

const { uploadToServer } = require('../utils/upload');

const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

router.route("/register").post(uploadToServer.single('avatar'), register); // works

router.route("/login").post(login); // works

router.route("/logout").get(logout);  // works

router.route("/follow/:id").get(isAuthenticated, followUser);   // works

router.route("/update/password").put(isAuthenticated, updatePassword);  // works

router.route("/update/profile").put(isAuthenticated, uploadToServer.single('avatar'), updateProfile);

router.route("/me").get(isAuthenticated, myProfile); //working

router.route("/my/posts").get(isAuthenticated, getMyPosts); //working

router.route("/userposts/:id").get(isAuthenticated, getUserPosts);  //working get user's  post  user id

router.route("/user/:id").get(isAuthenticated, getUserProfile); //working

router.route("/users").get(isAuthenticated, getAllUsers); //working



module.exports = router;
