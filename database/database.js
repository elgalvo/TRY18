const sequelize = require('sequelize')
const { Sequelize } = require('sequelize')

const connection = new Sequelize('brindelsistema', 'root', 'brindel', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
})

module.exports = connection