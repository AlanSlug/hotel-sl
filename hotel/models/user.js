'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var userSchema = Schema({
    nombre: String,
    apellidoPaterno: String,
    apellidoMaterno: String,
    user: String,
    imagen: String,
    perfil: String,
    pass: String
})

module.exports = mongoose.model('User', userSchema)