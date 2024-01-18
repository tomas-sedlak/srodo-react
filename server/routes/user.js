var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;
var User = require("../models/user")

router.get("/", function (req, res) {
  if (req.query.id) {
    User.findById(req.query.id)
      .then((user) => res.send(user))
  }

  if (req.query.username) {
    User.findOne({ username: req.query.username })
      .then((user) => res.send(user))
  }
})

router.put("/:userId/saves", async (req, res) => {
  const postId = req.body.postId;
  const userId = req.params.userId;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const postIndex = user.saved.indexOf(postId);
  if (postIndex === -1) {
    user.saved.push(postId);
  } else {
    user.saved.splice(postId, 1);
  }

  user.save();
})

router.get("/:userId/saves", (req, res) => {
  User.findById(req.params.userId)
    // .populate("saved")
    .then((user) => res.send(user.saved))
})

module.exports = router;
