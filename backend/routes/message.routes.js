const express = require('express')
const {SendMessage, GetMessage} = require('../controllers/message.controllers')
const requiredLogin = require('../middelwares/requiredLogin')


const router = express.Router()

// send message 
router.route('/sendmessage/:id').post(requiredLogin,SendMessage)

// get message 
router.route('/getmessage/:id').get(requiredLogin,GetMessage)

module.exports = router