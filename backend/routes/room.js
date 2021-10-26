'use strict'

var express = require('express')
var roomController = require('../controllers/room')
var router = express.Router()
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart({ uploadDir: './uploads' })

router.get('/home', roomController.home)
router.post('/test', roomController.test)
router.post('/save-room', roomController.saveRoom)
router.get('/room/:id?', roomController.getRoom)
router.get('/rooms/', roomController.getRooms)
router.put('/update-room/:id', roomController.updateRoom)
router.delete('/delete-room/:id', roomController.deleteRoom)
router.post('/upload-image/:id', multipartMiddleware, roomController.uploadImage)

module.exports = router