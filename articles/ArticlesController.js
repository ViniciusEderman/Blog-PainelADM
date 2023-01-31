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

router.post("/articles/delete", (req, res) => {

    const id = req.body.id;

    if(id != undefined) {
        if(!isNaN(id)) {
            Article.destroy({
                where: {
                    id: id,
                }
            }).then(() => {
                res.redirect("/admin/articles");
            });
        } 
        else{
            res.redirect("/admin/articles");
        }
    } 
    else{
        res.redirect("/admin/articles");
    }
});

router.get("/admin/articles/edit/:id", (req, res) => {
    const id = req.params.id;

    Article.findByPk(id).then(article => {
        if(article != undefined) {

            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {article : article, categories: categories});
            });

        } else {
            res.redirect("/");
        }
    }).catch(error => {
        console.log(error);
        res.redirect("/");
    });
});

router.post("/articles/update", (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const body = req.body.body;
    const category = req.body.category;

    Article.update({title: title, body: body, categoryId: category, slug: slugify(title)}, {
        where: {
            id: id,
        }
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch(error => {
        console.log(error);
        res.redirect("/");
    })
});

router.get("/articles/page/:pageNum", (req, res) => {
    const page = req.params.pageNum;
    let offset = 0;
    
    if(isNaN(page) || page == 1) {
        offset = 0;
    } else {
        offset = parseInt(page) * 8;
    }

    Article.findAndCountAll(
        {
            limit: 8,   // limita a quantidade de dados que serão mostrados
            offset: offset,
        }
    ).then(articles => {      //pesquisa e retorna a quantidade de elementos da tabela

        let next;

        if(offset + 8 >= articles.count) {
            next = false;
        } else {
            next = true;
        }

        let results = {
            next: next,
            articles: articles,

        }

        Category.findAll().then(categories => {
            res.render("admin/articles/page", {results: results, categories: categories})
        });
    }) 
});

module.exports = router;
