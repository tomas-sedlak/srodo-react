var express = require('express');
var router = express.Router();
var Article = require("../models/article")

router.post("/article", (req, res) => {
    const image = req.body.image;
    const title = req.body.title;
    const content = req.body.content;
    const author = req.body.author;

    Article.create({
        image: image,
        title: title,
        content: content,
        author: author,
    });
});

module.exports = router;