var express = require('express');
var router = express.Router();
var Post = require("../models/post")
var Category = require("../models/category")
var User = require("../models/user")

router.get('/', function(req, res, next) {
  Post.find({})
    .sort("createdAt")
    .then((posts) => res.send(posts))
});

router.get("/categories", function(req, res) {
  Category.find({})
    .sort("index")
    .then((categories) => res.send(categories))
})

router.get("/user", function(req, res) {
  if (req.query.id) {
    User.findById(req.query.id)
      .then((user) => res.send(user))
  }

  if (req.query.username) {
    User.findOne({ username: req.query.username })
      .then((user) => res.send(user))
  }
})

router.get("/post/:id", function(req, res) {
  Post.findById(req.params.id)
    .then((post) => res.send(post))
})

module.exports = router;
