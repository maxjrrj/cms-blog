const Sequelize = require('sequelize')
const connection = require('./database.js')

const Categoria = connection.define('categoria', {
    idcategoria: {
        type: Sequelize.INTEGER,
        primaryKey: true

    },

    titulocategoria: {
        type: Sequelize.STRING,
        allowNull: false
    }
    

})

Categoria.sync({force: false}).then(()=> {}).catch(() => {})

module.exports = Categoria