require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const Article = require('./articles/Article');
const Category = require('./categories/Category');


//load view engine:
app.set('view engine', 'ejs');

app.use(express.static('public'));

//body parser:
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//db:
connection
    .authenticate()
    .then(() => {
        console.log("sucess");

    }).catch((error) => {
        console.log(`Error: ${error}`);
    })
;

app.use("/", categoriesController);
app.use("/", articlesController);

app.get("/", (req, res) => {

   Article.findAll({
        order: [
            ['id', 'DESC']
        ]
   }).then(articles => {
        res.render("index", {articles: articles});
   }).catch(error => {
        console.log(error);
   });
});

app.get("/:slug", (req, res) => {
    const slug = req.params.slug;

    Article.findOne({
        where: {
            slug: slug,
        }
    }).then(article => {
        if(article != undefined) {
            res.render("articles", {article: article});
        }
        else {
            res.redirect("/");
        }
    }).catch(error => {
        console.log(error);
        res.redirect("/");
    })
});

app.listen(8080, () => {
    console.log("server is run!");
});
