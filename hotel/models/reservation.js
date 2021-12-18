'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ReservationSchema = Schema({
    checkin: String,
    checkout: String,
    huesped: Object,
    habitacion: Object,
    adultos: Number,
    ninos: Number,
    costo: Number,
    recepcionista: String,
    noches: String
})

module.exports = mongoose.model('Reservation', ReservationSchema)