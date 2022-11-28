const { Sequelize } = require('sequelize');

const connection = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD, { // utilizando o ENV para evitar vazar dados
    host: process.env.HOST,
    dialect: 'mysql',
    logging: false
});

module.exports = connection;