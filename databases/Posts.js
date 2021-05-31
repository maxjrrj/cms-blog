const Sequelize = require('sequelize')
const connection = require('./database.js')

const Post = connection.define('post', {
    postid: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true

    },

    titulo: {
        type: Sequelize.STRING,
        allowNull: true
    },    

    sinopse: {
        type: Sequelize.STRING,
        allowNull: true
    },

    texto: {
        type: Sequelize.STRING,
        allowNull: true
    }
    

})

Post.sync({force: false}).then(()=> {}).catch(() => {})

module.exports = Post