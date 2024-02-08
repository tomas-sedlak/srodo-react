var express = require('express');
var router = express.Router();
var schedule = require("node-schedule");
var scraper = require("../scraper");
var Post = require("../models/post")
var User = require("../models/user")
var Subject = require("../models/subject")
var News = require("../models/news")
var Comment = require("../models/comment")
var Quiz = require("../models/quiz")

// Initial call for scraper
scraper();
// Schedule news scraping every midnight
schedule.scheduleJob("0 0 * * *", scraper);

router.get('/', async (req, res) => {
  const page = req.query.page || 1
  const limit = req.query.limit || 5
  const userId = req.query.userId || undefined

  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1))
    .populate("author", "username displayName profilePicture")
    .populate("subject")

  let user
  if (userId) user = await User.findById(userId)

  const processedPosts = await Promise.all(posts.map(async post => {
    const comments = await Comment.find({ post: post._id })

    return {
      _id: post._id,
      postType: post.postType,
      coverImage: post.coverImage,
      title: post.title,
      author: post.author,
      saved: user ? user.saved.includes(post._id) : false,
      liked: user ? post.likes.includes(user._id) : false,
      likesCount: post.likes.length,
      commentsCount: comments.length,
      createdAt: post.createdAt,
    }
  }))

  res.send(processedPosts)
});

router.get("/post/:postId", async (req, res) => {
  const post = await Post.findById(req.params.postId)
    .populate("author", "username displayName profilePicture")
    .populate("subject")
    .populate("quiz")

  res.send(post)
});

router.put("/post/:postId/like", async (req, res) => {
  const postId = req.params.postId;
  const userId = req.body.userId;

  const post = await Post.findById(postId)

  const liked = post.likes.includes(userId)
  liked ? post.likes.splice(userId, 1) : post.likes.push(userId)

  post.save();

  res.send({
    liked: liked,
    likesCount: post.likes.length,
  });
});

router.get("/post/:postId/comment", async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .sort({ createdAt: -1 })
    .populate("author", "username displayName profilePicture")

  res.send(comments)
})

router.post("/post/:postId/comment", async (req, res) => {
  const postId = req.body.postId;
  const userId = req.body.userId;
  const content = req.body.content;
  const reaction = req.body.reaction;

  await Comment.create({
    post: postId,
    author: userId,
    content: content,
  })

  res.sendStatus(201)
})

router.get("/subjects", async (req, res) => {
  const subjects = await Subject.find({})
    .sort("index")

  res.send(subjects)
});

router.get("/news", async (req, res) => {
  const news = await News.find({ category: req.query.category })
    .sort("index")

  res.send(news)
});

router.post("/create", async (req, res) => {
  const type = req.body.type;
  const subjectId = req.body.subjectId;
  const coverImage = req.body.coverImage;
  const title = req.body.title;
  const content = req.body.content;
  const authorId = req.body.authorId;

  const postData = {
    postType: type,
    subject: subjectId,
    coverImage: coverImage,
    title: title,
    content: content,
    author: authorId,
  };

  if (type === "quiz") {
    const questions = req.body.questions;

    questions.map(async question => {
      const quiz = await Quiz.create({
        question: question.question,
        image: question.image,
        options: question.options,
        correctOption: question.correctOption,
      })

      postData.quiz.push(quiz._id)
    })
  }

  Post.create(postData);
});

module.exports = router;
