const Sequelize = require('sequelize');

const connection = new Sequelize('nome_banco', 'root', '1234',{
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

module.exports = connection;