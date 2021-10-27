'use strict'
var app = require('./app')
var port = 3700

var mongoose = require('mongoose')
mongoose.Promise = global.Promise;

//mongoose.connect('mongodb://localhost:27017/hotel')
mongoose.connect('mongodb+srv://slug:slug123@cluster0.9anpc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(() => {
        console.log('Conexion MongoDB establecida con exito')
        //Creacion del servidor
        app.listen(port, ()=> {
            console.log('Servidor corriendo correctamente en url: localhost:3700')
        })
    }).catch(err => console.log('Error en la conexion MongoDB ' + err))