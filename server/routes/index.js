var express = require('express');
var router = express.Router();
var schedule = require("node-schedule");
var scraper = require("../scraper");
var Post = require("../models/post")
var Subject = require("../models/subject")
var News = require("../models/news")

// Initial call for scraper
scraper();
// Schedule news scraping every midnight
schedule.scheduleJob("0 0 * * *", scraper);

router.get('/', (req, res, next) => {
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

router.get("/subjects", (req, res) => {
  Subject.find({})
    .sort("index")
    .then((subjects) => res.send(subjects))
});

router.get("/news", (req, res) => {
  const category = req.query.category;

  News.find({ category: category })
    .sort("index")
    .then((news) => res.send(news))
});

router.post("/create", (req, res) => {
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
