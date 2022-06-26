const User = require("../models/User")
const Post = require("../models/Post")
// const cloudinary1 = require("cloudinary").v2
const cloudinary = require('../utils/upload')
const {cloudinary, multer} = require('../middlewares/upload')


exports.register = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body

    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ success: false, message: "User already exists" })
    }

    const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
      folder: "avatars",
    })

    user = await User.create({
      name,
      email,
      password,
      avatar: { public_id: myCloud.public_id, url: myCloud.secure_url },
    })
    console.log(req.host)
    const token = await user.generateToken()

    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    }

    res.status(201).cookie("token", token, options).json({
      success: true,
      user,
      token,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
      .select("+password")
      .populate("posts followers following")

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      })
    }

    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      })
    }

    const token = await user.generateToken()

    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    }

    res.status(200).cookie("token", token, options).json({
      success: true,
      user,
      token,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
      .json({
        success: true,
        message: "Logged out",
      })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id)
    const loggedInUser = await User.findById(req.user._id)

    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    if (loggedInUser.following.includes(userToFollow._id)) {
      const indexfollowing = loggedInUser.following.indexOf(userToFollow._id)
      const indexfollowers = userToFollow.followers.indexOf(loggedInUser._id)

      loggedInUser.following.splice(indexfollowing, 1)
      userToFollow.followers.splice(indexfollowers, 1)

      await loggedInUser.save()
      await userToFollow.save()

      res.status(200).json({
        success: true,
        message: "User Unfollowed",
      })
    } else {
      loggedInUser.following.push(userToFollow._id)
      userToFollow.followers.push(loggedInUser._id)

      await loggedInUser.save()
      await userToFollow.save()

      res.status(200).json({
        success: true,
        message: "User followed",
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password")

    const { oldPassword, newPassword } = req.body

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide old and new password",
      })
    }

    const isMatch = await user.matchPassword(oldPassword)

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Old password",
      })
    }

    user.password = newPassword
    await user.save()

    res.status(200).json({
      success: true,
      message: "Password Updated",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    const { name, email, avatar } = req.body

    if (name) {
      user.name = name
    }
    if (email) {
      user.email = email
    }

    if (avatar) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id)

      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
      })
      user.avatar.public_id = myCloud.public_id
      user.avatar.url = myCloud.secure_url
    }

    await user.save()

    res.status(200).json({
      success: true,
      message: "Profile Updated",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


exports.myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "posts followers following"
    )

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "posts followers following"
    )

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      name: { $regex: req.query.name, $options: "i" },
    })

    res.status(200).json({
      success: true,
      users,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


exports.getMyPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    const posts = []

    for (let i = 0; i < user.posts.length; i++) {
      const post = await Post.findById(user.posts[i]).populate(
        "likes comments.user owner"
      )
      posts.push(post)
    }

    res.status(200).json({
      success: true,
      posts,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.getUserPosts = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    const posts = []

    for (let i = 0; i < user.posts.length; i++) {
      const post = await Post.findById(user.posts[i]).populate(
        "likes comments.user owner"
      )
      posts.push(post)
    }

    res.status(200).json({
      success: true,
      posts,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
