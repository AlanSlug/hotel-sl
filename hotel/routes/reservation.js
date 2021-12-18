'use strict'

var express = require('express')
var reservationController = require('../controllers/reservation')
var router = express.Router()

router.get('/reservation', reservationController.getReservations)
router.get('/reservation/:id', reservationController.getReservation)
router.post('/reservation', reservationController.saveReservation)
router.put('/reservation/:id', reservationController.updateReservation)
router.delete('/reservation/:id', reservationController.deleteReservation)

module.exports = router