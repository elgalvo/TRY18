const mongoose = require('mongoose')
const Schema = mongoose.Schema
//const connectionDb = require('../database/database')
const User = require('./User')

const IdeaSchema = new Schema( {
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: false,
    },
    executed:{
        type: Boolean,
        default: false,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true
    }

}, {timestamps: true})


module.exports = mongoose.model('Idea', IdeaSchema)
