const Post = require("../models/post");
const User = require("../models/user");
const { uploadToCloud, deleteFromCloud, deletFromServer } = require('../utils/upload');

exports.createPost = async (req, res) => {  // create a new post
  try {
    let myCloud = "";

    if (req.file) { // if there is a file uploaded
      myCloud = await uploadToCloud(req.file.path, 'social/posts'); // upload image to cloudinary
      await deletFromServer(req.file.path); // delete image from server
    }
    const newPostData = {
      caption: req.body.caption,
      image: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      owner: req.user._id,  // the user who is logged in
    };

    const post = await Post.create(newPostData);  // creating a new post

    const user = await User.findById(req.user._id); // find the user who is logged in

    user.posts.unshift(post._id); // unshift adds to the beginning of the array
    await user.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deletePost = async (req, res) => {  // delete a post
  try {
    const post = await Post.findById(req.params.id);    // find the post by post's id

    if (!post) {  // if post is not found
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.owner.toString() !== req.user._id.toString()) {  // if the post owner is not the same as the user who is logged in
      return res.status(401).json({
        success: false,
        message: "Unauthorized, you can only delete your own post",
      });
    }

    await deleteFromCloud(post.image.public_id); // delete image from cloudinary

    await post.remove(); // remove the post from the database

    const user = await User.findById(req.user._id); // find the user who is logged in

    const index = user.posts.indexOf(req.params.id);  // find the index of the post in the user's posts array
    user.posts.splice(index, 1);  // remove the post from the user's posts array

    await user.save();

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.likeAndUnlikePost = async (req, res) => { // like and unlike a post (toggle)
  try {
    const post = await Post.findById(req.params.id);  // find the post by post's id

    if (!post) {  // if post is not found
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.likes.includes(req.user._id)) {  // if the user has already liked the post
      const index = post.likes.indexOf(req.user._id); // find the index of the user in the likes array

      post.likes.splice(index, 1);  // remove the user from the likes array

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Post Unliked",
      });
    } else {  // if the user has not liked the post
      post.likes.push(req.user._id);  // add the user to the likes array

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Post Liked",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPostOfFollowing = async (req, res) => {  // get all posts of the users who are following the user who is logged in
  try {
    const user = await User.findById(req.user._id); // find the user who is logged in

    const posts = await Post.find({ // find all posts of the users who are following the user who is logged in and populate the owner, like and other field
      owner: {
        $in: user.following,
      },
    }).populate("owner likes comments.user");

    res.status(200).json({
      success: true,
      posts: posts.reverse(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.commentOnPost = async (req, res) => { // comment on a post
  try {
    const post = await Post.findById(req.params.id);  // find the post by post's id

    if (!post) {  // if post is not found
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.comments.push({  // add a comment to the comments array
      user: req.user._id,
      comment: req.body.comment,
    });

    await post.save();
    return res.status(200).json({
      success: true,
      message: "Comment added",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteComment = async (req, res) => { // delete a comment
  try {
    const post = await Post.findById(req.params.id);  // find the post by post's id

    if (!post) {  // if post is not found
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Checking If owner wants to delete his own comment
    if (post.owner.toString() === req.user._id.toString()) {
      if (req.body.commentId === undefined) {
        return res.status(400).json({
          success: false,
          message: "Comment Id is required",
        });
      }

      post.comments.forEach((item, index) => {  // find the comment by comment's id
        if (item._id.toString() === req.body.commentId.toString()) {
          return post.comments.splice(index, 1);
        }
      });

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Selected Comment has deleted",
      });
    } else {  // if the user is not the owner of the post
      post.comments.forEach((item, index) => {    // find the comment by comment's id
        if (item.user.toString() === req.user._id.toString()) { // if the user is the owner of the comment
          return post.comments.splice(index, 1);
        }
      });

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Your Comment has deleted",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
