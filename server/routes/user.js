var express = require('express');
var router = express.Router();
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

router.put("/:userId/saved", async (req, res) => {
  const postId = req.body.postId;
  const userId = req.params.userId;

  const user = await User.findById(userId);

  const saved = user.saved.includes(postId)
  saved ? user.saved.splice(postId, 1) : user.saved.push(postId)

  user.save();

  res.send({
    saved: saved,
  });
})

router.get("/:userId/saved", (req, res) => {
  User.findById(req.params.userId)
    // .populate("saved")
    .then((user) => res.send(user.saved))
})

module.exports = router;
