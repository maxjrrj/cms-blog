const Sequelize = require('sequelize')

const connection = new Sequelize('cms-blog', 'root', 'password', {
    host:'localhost',
    dialect: 'mysql'
})

module.exports = connection