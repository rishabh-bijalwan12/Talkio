const jwt = require('jsonwebtoken')

const User = require('../models/user.model')

require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET

module.exports = (req,res,next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: "You must be logged in" });
    }

    const token = authorization.replace("Bearer ","")

    jwt.verify(token,JWT_SECRET,(error,payload)=>{
        if(error){
            return res.status(401).json({ error: "You must be logged in" });
        }
        const {_id} = payload

        User.findOne({_id}).then(userData => {
            if (!userData) {
                return res.status(401).json({ error: "User not found. Please log in again." });
            }
            req.user = userData;
            next();
        }).catch(err => {
            console.log(err.message)
            return res.status(500).json({ error: "Internal Server Error " });
        });
    })

}