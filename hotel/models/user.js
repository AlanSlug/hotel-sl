'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var userSchema = Schema({
    nombre: String,
    apellidoPaterno: String,
    apellidoMaterno: String,
    alias: String,
    imagen: String,
    perfil: String,
    pass: String
})

module.exports = mongoose.model('User', userSchema)