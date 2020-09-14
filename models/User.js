const Sequelize = require('sequelize')
const connectionDb = require('../database/database')


const User = connectionDb.define('users', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    admin:{
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    salary:{
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 1200
    }
}, {timestamps: true})


module.exports = User