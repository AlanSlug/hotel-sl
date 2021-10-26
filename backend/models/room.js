'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var RoomSchema = Schema({
    id: String,
    tipo: String,
    servicios: Array,
    disponibilidad: String,
    imagen: String,
    descripcion: String,
    precio: Number
})

module.exports = mongoose.model('Room', RoomSchema)