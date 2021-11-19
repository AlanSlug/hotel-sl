'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const app = express()

//Cargar archivos de rutas
const roomRoutes = require('./routes/room')
const guestRoutes = require('./routes/guest')
const userRoutes = require('./routes/user')

//Motor de plantillas
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.use(express.static(__dirname + '/public'));

//Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
 
// Configurar cabeceras y CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

/**RUTAS**/
//FRONT
app.get('', (req, res) => {
    res.render("home")
})
app.get('/home', (req, res) => {
    res.render("home")
})
app.get('/habitaciones', (req, res) => {
    res.render("habitaciones")
})
app.get('/huespedes', (req, res) => {
    res.render("huespedes")
})


//API
app.use('/api', roomRoutes)
app.use('/api', guestRoutes)
app.use('/api', userRoutes)
app.get('/test', (req, res) => {
    res.status(200).send({
        message: "Hola mundo desde mi API de Node.js"
    })
})
app.post('/imprimir/:id', (req, res) => {
    console.log("Imprimir valor Body " + req.body.valor)
    console.log("Imprimir nombre query " + req.query.nombre)
    console.log("Imprimir id params " + req.params.id)
    res.status(200).send({
        message: "mensaje"
    })
})
app.use((req, res, next) => {
    res.status(404).render("404")
})
//Exportar
module.exports = app