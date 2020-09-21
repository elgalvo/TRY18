const Sequelize = require('sequelize')
const connectionDb = require('../database/database')
const User = require('./User')

const Vales = connectionDb.define('vales', {
    value: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    executed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
}, {timestamps: true})





User.hasMany(Vales)
Vales.belongsTo(User)


module.exports = Vales