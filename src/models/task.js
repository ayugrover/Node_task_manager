const mongoose = require('mongoose');
const validator = require('validator');

const taskSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    completed:{
        type: Boolean,
        default:false,
    }
},{
    timeStamps: true
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task