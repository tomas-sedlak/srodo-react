var express = require('express');
var router = express.Router();
var Article = require("../models/article")
var Category = require("../models/category")

router.get('/', function (req, res, next) {
  const page = req.query.page || 1
  const perPage = 5

  Article.find()
    .sort("createdAt")
    .limit(perPage)
    .skip(perPage * (page - 1))
    .then((posts) => res.send(posts))
});

router.get("/categories", function (req, res) {
  Category.find({})
    .sort("index")
    .then((categories) => res.send(categories))
})

module.exports = router;
