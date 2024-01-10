var express = require('express');
var router = express.Router();
var Post = require("../models/post")
var Subject = require("../models/subject")

router.get('/', function (req, res, next) {
  const page = req.query.page || 1
  const perPage = 5

  Post.find()
    .sort("createdAt")
    .limit(perPage)
    .skip(perPage * (page - 1))
    .populate("author", "displayName profilePicture")
    .populate("subject")
    .populate("comments")
    .then((posts) => res.send(posts))
});

router.get("/subjects", function (req, res) {
  Subject.find({})
    .sort("index")
    .then((subjects) => res.send(subjects))
});

router.post("/new", (req, res) => {
  const type = req.body.type;
  const coverImage = req.body.coverImage;
  const title = req.body.title;
  const content = req.body.content;
  const authorId = req.body.authorId;

  Post.create({
      type: type,
      coverImage: coverImage,
      title: title,
      content: content,
      author: authorId,
  });
});

module.exports = router;
