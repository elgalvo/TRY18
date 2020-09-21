const Sequelize = require('sequelize')
const connectionDb = require('../database/database')
const User = require('./User')

const Idea = connectionDb.define('ideas', {
    title:{
        type:Sequelize.STRING,
        allowNull: false
    },
    description:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    executed:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
}, {timestamps: true})

Idea.belongsTo(User)
User.hasMany(Idea)

module.exports = Idea
