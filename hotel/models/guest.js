'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var GuestSchema = Schema({
    nombre: String,
    apellidoPaterno: String,
    apellidoMaterno: String,
    direccion: String,
    sexo: String,
    telefono: String,
    correo: String,
    observaciones: String
})

module.exports = mongoose.model('Guest', GuestSchema)