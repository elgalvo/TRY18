const mongoose = require('mongoose')
// const connectionDb = require('../database/database')
const Schema = mongoose.Schema

const ValeSchema = new Schema({
    value: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    executed: {
        type: Boolean,
        default: false,
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
}, {timestamps: true})

ValeSchema.static.getByMonthAndYear = (vales, month, year)=>{
    function sameMonthAndYear(vale){
        if(vale.createdAt.getMonth() == parseInt(month)){
            if(vale.createdAt.getFullYear() == parseInt(year)){
                return vale
            }
        }
    }
    return vales.filter(sameMonthAndYear)
}


module.exports = mongoose.model('Vales', ValeSchema)