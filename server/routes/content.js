var express = require('express');
var router = express.Router();
var Post = require("../models/post")

router.get("/post", (req, res) => {
    Post.findById(req.query.id)
        .then((article) => res.send(article))
});

module.exports = router;