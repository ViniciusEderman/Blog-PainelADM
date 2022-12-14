const express = require('express');
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");

router.get("/admin/articles", (req, res) => {
    
    Article.findAll({
        include: [{model: Category,}]

    }).then(articles => {
        res.render("admin/articles/index", {articles: articles})
    });
});

router.get("/admin/articles/new", (req, res) => {

    Category.findAll().then(categories => {
        res.render("admin/articles/new", 
        {categories: categories});
    })
});

router.post("/articles/save", (req, res) => {
    const title = req.body.title;
    const body = req.body.body;
    const category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title), // usando a biblioteca e gerando um slug em base do title
        body: body,
        categoryId: category,
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch((err) => {
        console.log(err);
        res.redirect("/");  
    }); 
});

module.exports = router;