const express = require('express');
const { Register,Login, GetAllUser, GetUser} = require('../controllers/auth.controller');

const router = express.Router();
// register
router.route('/register').post(Register)

//login
router.route('/login').post(Login)

//get all users
router.route('/users').get(GetAllUser)

//get user by id
router.route('/user/:id').get(GetUser)

module.exports = router