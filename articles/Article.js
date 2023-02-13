const Sequelize = require('sequelize');
const connection = require('../database/database');
const Category = require('../categories/Category');

const Article = connection.define('articles', { // criando as tabelas, title, slug e body
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false,
    }
});

// uma categoria tem muitos artigos
Category.hasMany(Article); // 1 para muitos

//article pertence a category
Article.belongsTo(Category); // 1 para 1

module.exports = Article;