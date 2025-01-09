const mongoose = require('mongoose')

const Message = require('./message.model')
const User = require('./user.model')

const conversation = mongoose.Schema({
    usersId:[{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }],
    messages:[{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Message'
    }]
})

const Conversation = mongoose.model('Conversation',conversation)

module.exports = Conversation