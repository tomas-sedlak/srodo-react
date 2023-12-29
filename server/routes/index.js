var express = require('express');
var router = express.Router();
var Article = require("../models/article")
var Category = require("../models/category")

router.get('/', function(req, res, next) {
  Article.find({})
    .sort("createdAt")
    .then((posts) => res.send(posts))
});

router.get("/categories", function(req, res) {
  Category.find({})
    .sort("index")
    .then((categories) => res.send(categories))
})

module.exports = router;
