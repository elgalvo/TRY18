const mongoose = require('mongoose')
const Schema = mongoose.Schema


const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    admin:{
        type: Boolean,
        default: false,
    },
    salary:{
        type: Number,
        required: true
    },

}, {timestamps: true})

module.exports = mongoose.model('User', UserSchema)