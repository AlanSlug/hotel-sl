'use strict'

var express = require('express')
var userController = require('../controllers/user')
var router = express.Router()

router.get('/user/:id', userController.getUser)
router.get('/users', userController.getUsers)
router.post('/user', userController.saveUser)
router.post('/login', userController.login)

module.exports = router