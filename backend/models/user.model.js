const mongoose = require('mongoose')

const user = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false
    }
})

const User = mongoose.model("User",user);

module.exports = User