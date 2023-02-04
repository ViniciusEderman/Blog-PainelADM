require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');

const bodyParser = require('body-parser');
const connection = require('./database/database');

const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./users/UserController');

const Article = require('./articles/Article');
const Category = require('./categories/Category');
const User = require('./users/User');



//load view engine:
app.set('view engine', 'ejs');

app.use(express.static('public'));

//Sessions:
app.use(session({
    secret: "cookie_secret", cookie: { maxAge: 7200000 },
    resave: true,
    saveUninitialized: true
}));

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
app.use("/", usersController);

app.get("/session", (req, res) => {
    req.session.teste = "teste";

    res.send("Sessao gerada")
});

app.get("/leitura", (req, res) => {
    res.json({
       teste: req.session.teste,
    })
});


app.get("/", (req, res) => {

   Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 6,
   }).then(articles => {

    Category.findAll().then(categories => {
        res.render("index", {articles: articles, categories: categories});
    })
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
            Category.findAll().then(categories => {
                res.render("articles", {article: article, categories: categories});
            });
        }
        else {
            res.redirect("/");
        }
    }).catch(error => {
        console.log(error);
        res.redirect("/");
    })
});

app.get("/category/:slug", (req, res) => {
    const slug = req.params.slug;

    Category.findOne({
        where: {
           slug: slug ,
        },
        include: [{ model: Article }] //join with articles
    }).then( category => {
        if(category != undefined) {
            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories});
            })
        }
        else{
            res.redirect("/");
        }
    }).catch(err => {
        console.log(err);
        res.redirect("/");
    })
});

app.listen(8080, () => {
    console.log("server is run!");
});
