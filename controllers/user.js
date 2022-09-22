const User = require("../models/user");
const Post = require("../models/post");
const { uploadToCloud, deletFromServer, deleteFromCloud } = require('../utils/upload');

exports.register = async (req, res) => {    //register a new user
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) { //if user already exists
      if (req.file) {
        await deletFromServer(req.file.path); //delete the image from the server  if it exists
      }
      return res.status(400).json({ success: false, message: "User already exists" });
    }
    let myCloud = "";

    if (req.file) { //if image is uploaded
      if (!req.file.mimetype.includes('image')) { //if the uploaded file is not an image
        await deletFromServer(req.file.path); //delete the image from the server  if it exists
        return res.status(400).json({
          message: 'Only .png, .jpg and .jpeg format allowed!'
        });
      }

      if (req.file.size > 1000000) { // 1mb default limit
        await deletFromServer(req.file.path);
        return res.status(400).json({
          message: 'File size is too large, limit is 1mb'
        });
      }

      myCloud = await uploadToCloud(req.file.path, 'social/avatar');  //upload the image to cloudinary
      await deletFromServer(req.file.path); //delete the image from the server  if it exists
    }

    user = await User.create({
      name,
      email,
      password,
      avatar: { public_id: myCloud.public_id, url: myCloud.secure_url },
    });

    const token = await user.generateToken(); //generate a token for the user

    const options = { //options for the cookie
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(201).cookie("token", token, options).json({  //send the cookie and the user data
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.login = async (req, res) => { //login a user
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email })  //find the user by email
      .select("+password")                    //select the password field because it is not returned by default
      .populate("posts followers following"); //populate the posts, followers and following fields of the user

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) { //if the password is not correct
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = await user.generateToken(); //generate a token for the user

    const options = { //options for the cookie
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(200).cookie("token", token, options).json({  //send the cookie and the user data
      success: true,
      message: "Logged in successfully",
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.logout = async (req, res) => {  //logout a user
  try {
    res
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true }) //delete the cookie
      .json({
        success: true,
        message: "Logged out",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.followUser = async (req, res) => {  //follow a user
  try {
    const userToFollow = await User.findById(req.params.id);  //find the user to follow by id
    const loggedInUser = await User.findById(req.user._id); //find the logged in user by id

    if (!userToFollow) {  //if the user to follow does not exist
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (loggedInUser.following.includes(userToFollow._id)) {  //if the user is already following the user to follow
      const indexfollowing = loggedInUser.following.indexOf(userToFollow._id);  //find the index of the user to follow in the following array
      const indexfollowers = userToFollow.followers.indexOf(loggedInUser._id);  //find the index of the logged in user in the followers array

      loggedInUser.following.splice(indexfollowing, 1); //remove the user to follow from the following array of the logged in user
      userToFollow.followers.splice(indexfollowers, 1); //remove the logged in user from the followers array of the user to follow

      await loggedInUser.save();
      await userToFollow.save();

      res.status(200).json({
        success: true,
        message: "User Unfollowed",
      });
    } else {  //if the user is not following the user to follow
      loggedInUser.following.push(userToFollow._id);  //add the user to follow to the following array of the logged in user
      userToFollow.followers.push(loggedInUser._id);  //add the logged in user to the followers array of the user to follow

      await loggedInUser.save();
      await userToFollow.save();

      res.status(200).json({
        success: true,
        message: "User followed",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updatePassword = async (req, res) => {  //update the password of a user
  try {
    const user = await User.findById(req.user._id).select("+password"); //find the user by id and select the password field because it is not returned by default

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) { //if the old password or the new password is not provided
      return res.status(400).json({
        success: false,
        message: "Please provide old and new password",
      });
    }

    const isMatch = await user.matchPassword(oldPassword);

    if (!isMatch) { //if the old password is not correct
      return res.status(400).json({
        success: false,
        message: "Incorrect Old password",
      });
    }

    user.password = newPassword;  //update the password of the user
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password Updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => { //update the profile of a user
  try {
    const user = await User.findById(req.user._id);

    const { name, email } = req.body;

    if (name) { //if the name is provided
      user.name = name;
    }
    if (email) {  //if the email is provided
      user.email = email;
    }

    if (req.file) { //if the avatar is provided
      if (!req.file.mimetype.includes('image')) { //if the file is not an image
        await deletFromServer(req.file.path); //delete the file from the server
        return res.status(400).json({
          message: 'Only .png, .jpg and .jpeg format allowed!'
        });
      }
      if (req.file.size > 1000000) {  //if file size is greater than 1mb
        await deletFromServer(req.file.path);
        return res.status(400).json({
          message: 'File size is too large, limit is 1mb'
        });
      }

      await deleteFromCloud(user.avatar.public_id); //delete the old avatar from cloudinary
      let myCloud = await uploadToCloud(req.file.path, 'social/avatar');  //upload the new avatar to cloudinary

      await deletFromServer(req.file.path); //delete the old avatar from the server
      user.avatar = { public_id: myCloud.public_id, url: myCloud.secure_url };  //update the avatar of the user
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile Updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.myProfile = async (req, res) => { //get the profile of the logged in user
  try {
    const user = await User.findById(req.user._id)
      .select("+email") //select the email field because it is not returned by default
      .populate("posts followers following")
      .populate({ path: "posts", select: "-owner" }); // -owner is to exclude the owner from the posts array

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserProfile = async (req, res) => {  //get the profile of a user
  try {
    const user = await User.findById(req.params.id).populate(
      "posts followers following"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,

    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => { //get all the users
  try {
    const { name } = req.query;

    if (!name) {    //if the name is not provided
      return res.status(400).json({
        success: false,
        message: "Please provide a name, to search",
      });
    }

    const users = await User.find({
      name: { $regex: name, $options: "i" },  //find all the users whose name matches the name provided in the query  $options: "i" is to make the search case insensitive
    });

    //if no user is found
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No user found",
      });
    }

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getMyPosts = async (req, res) => {  //get all the posts of the logged in user
  try {
    const user = await User.findById(req.user._id); //find the user by id

    const posts = [];

    for (let i = 0; i < user.posts.length; i++) { //loop through the posts array of the user
      const post = await Post.findById(user.posts[i]) //find the post by id
        .select("-owner")
        .populate("likes comments.user owner");
      posts.push(post);
    }

    res.status(200).json({
      success: true,
      total_posts: posts.length,
      posts

    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserPosts = async (req, res) => {  //get all the posts of a user
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const posts = [];

    for (let i = 0; i < user.posts.length; i++) { //loop through the posts array of the user
      const post = await Post.findById(user.posts[i]).populate(
        "likes comments.user owner"
      );
      posts.push(post);
    }

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
