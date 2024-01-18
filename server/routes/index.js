var express = require('express');
var router = express.Router();
var schedule = require("node-schedule");
var scraper = require("../scraper");
var Post = require("../models/post")
var User = require("../models/user")
var Subject = require("../models/subject")
var News = require("../models/news")

// Initial call for scraper
scraper();
// Schedule news scraping every midnight
schedule.scheduleJob("0 0 * * *", scraper);

router.get('/', async (req, res) => {
  const page = req.query.page || 1
  const perPage = 5
  const userId = "65a971b4abd72acd1db48cc2" // req.query.userId

  const user = await User.findById(userId);

  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .limit(perPage)
    .skip(perPage * (page - 1))
    .populate("author", "username displayName profilePicture")
    .populate("subject")
    .populate("comments")

  const processedPosts = posts.map(post => {
    const saved = user.saved.includes(post._id)
    const liked = post.likes.includes(user._id)

    return {
      _id: post._id,
      type: post.postType,
      coverImage: post.coverImage,
      title: post.title,
      author: post.author,
      saved: saved,
      liked: liked,
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
    }
  })

  res.send(processedPosts)
});

router.get("/post/:postId", (req, res) => {
  Post.findById(req.params.postId)
    .populate("author", "username displayName profilePicture")
    .populate("subject")
    .populate("comments")
    .then((posts) => res.send(posts))
});

router.put("/post/:postId/like", async (req, res) => {
  const postId = req.params.postId;
  const userId = req.body.userId;

  const post = await Post.findById(postId);

  const userIndex = post.likes.indexOf(userId);
  if (userIndex === -1) {
    post.likes.push(userId);
  } else {
    post.likes.splice(userId, 1);
  }

  post.save();
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
  const subjectId = req.body.subjectId;
  const coverImage = req.body.coverImage;
  const title = req.body.title;
  const content = req.body.content;
  const authorId = req.body.authorId;

  Post.create({
    postType: type,
    subject: subjectId,
    coverImage: coverImage,
    title: title,
    content: content,
    author: authorId,
  });
});

module.exports = router;
