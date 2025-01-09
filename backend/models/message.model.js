const mongoose = require('mongoose')

const User = require('./user.model')

const message = mongoose.Schema({
    message:{
        type:String,
        required:true
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    reciverId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
}, { timestamps: true })

const Message = mongoose.model('Message',message)

module.exports=Message