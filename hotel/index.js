'use strict'
const app = require('./app')

const mongoose = require('mongoose')
mongoose.Promise = global.Promise;

//settings
app.set('port', process.env.PORT || 3000)

//mongoose.connect('mongodb://localhost:27017/hotel')
mongoose.connect('mongodb+srv://slug:slug123@cluster0.9anpc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(() => {
        console.log('Conexion MongoDB establecida con exito')
    }).catch(err => console.log('Error en la conexion MongoDB ' + err))

//Creacion del servidor
app.listen(app.get('port'), () => {
    console.log('Servidor corriendo correctamente en puerto:' + app.get('port'))
})