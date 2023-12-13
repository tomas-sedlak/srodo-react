var express = require('express');
var router = express.Router();
var Post = require("../models/post")
var Category = require("../models/category")
var User = require("../models/user")

const categories = [
  {
      label: "Matematika",
      link: "/",
      leftSection: "📈"
  },
  {
      label: "Informatika",
      link: "/",
      leftSection: "💻"
  },
  {
      label: "Jazyky",
      link: "/",
      leftSection: "💬"
  },
  {
      label: "Biológia",
      link: "/",
      leftSection: "🧬"
  },
  {
      label: "Chémia",
      link: "/",
      leftSection: "🧪"
  },
  {
      label: "Fyzika",
      link: "/",
      leftSection: "⚡"
  },
  {
      label: "Geografia",
      link: "/",
      leftSection: "🌍"
  },
  {
      label: "Umenie",
      link: "/",
      leftSection: "🎨"
  },
  {
      label: "Šport",
      link: "/",
      leftSection: "💪"
  },
]

/* GET home page. */
router.get('/', function(req, res, next) {
  // const newPost = new Post({
  //   image: "https://wallpapers-clan.com/wp-content/uploads/2022/05/meme-pfp-13.jpg",
  //   title: "Another amazing post",
  //   content: "This time with author",
  //   author: "2a1d2as1d254212121sdas"
  // })

  // newPost.save()

  // categories.map(category => {
  //   Category.create({
  //     label: category.label,
  //     emoji: category.leftSection,
  //     url: category.link
  //   })
  // })

  // User.create({
  //   username: "admin",
  //   displayName: "This is my name",
  //   profilePicture: "https://wallpapers-clan.com/wp-content/uploads/2022/05/meme-pfp-13.jpg"
  // })

  Post.find({})
    .then((posts) => res.send(posts))
});

router.get("/categories", function(req, res) {
  Category.find({})
    .then((categories) => res.send(categories))
})

router.get("/user/:id", function(req, res) {
  User.findById(req.params.id)
    .then((user) => res.send(user))
})

router.get("/username/:id", function(req, res) {
  User.findOne({ username: req.params.id })
    .then((user) => res.send(user))
})

router.get("/post/:id", function(req, res) {
  Post.findById(req.params.id)
    .then((post) => res.send(post))
})

module.exports = router;
