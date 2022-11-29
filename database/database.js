const { Sequelize } = require('sequelize');

const connection = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD, { // utilizando o ENV para evitar vazar dados
    host: process.env.HOST,
    dialect: 'mysql',
    logging: false,
    timezone: "-03:00",
});

module.exports = connection;