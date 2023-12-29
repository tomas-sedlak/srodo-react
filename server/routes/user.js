var express = require('express');
var router = express.Router();
var User = require("../models/user")

router.get("/", function(req, res) {
  if (req.query.id) {
    User.findById(req.query.id)
      .then((user) => res.send(user))
  }

  if (req.query.username) {
    User.findOne({ username: req.query.username })
      .then((user) => res.send(user))
  }
})

module.exports = router;
