'use strict'

var express = require('express')
var guestController = require('../controllers/guest')
var router = express.Router()

router.get('/guests', guestController.getGuests)
router.get('/guest/:id', guestController.getGuest)
router.post('/guest', guestController.saveGuest)
router.put('/guest/:id', guestController.updateGuest)
router.delete('/guest/:id', guestController.deleteGuest)

module.exports = router