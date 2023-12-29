var express = require('express');
var router = express.Router();
var Article = require("../models/article")

router.get("/article", (req, res) => {
    Article.findById(req.query.id)
        .then((article) => res.send(article))
});

module.exports = router;