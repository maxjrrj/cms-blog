const Sequelize = require('sequelize')
const connection = require('./database.js')

const User = connection.define('user', {
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userid: {
        type: Sequelize.INTEGER,
    }

})

User.sync({force: false}).then(()=> {})

module.exports = User