const express = require('express');
const router = express.Router();

router.get("/articles", (req, res) => {
    res.send("teste")
});

router.get("/admin/articles/new", (req, res) => {
    res.send("teste1")
});

module.exports = router;