'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const session = require('express-session')
const flash = require('connect-flash')

//Cargar archivos de rutas
const roomRoutes = require('./routes/room')
const guestRoutes = require('./routes/guest')
const userRoutes = require('./routes/user')
const reservationRoutes = require('./routes/reservation')

//Motor de plantillas
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.use(express.static(__dirname + '/public'));

//Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
    secret: 'secretSl',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

// Configurar cabeceras y CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    //Global variables
    const user = req.flash('user')[0]
    console.log('user ' + JSON.stringify(user))
    if (user && user.user)
        res.locals.user = JSON.parse(JSON.stringify(user))
    console.log('Accediendo a req flash-2 ' + JSON.stringify(res.locals.user))
    next();
});

/**RUTAS**/
//FRONT
app.get('/login', (req, res) => {
    res.render("login")
})
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
app.get('/reservaciones', (req, res) => {
    res.render("reservaciones")
})

//API
app.use('/api', roomRoutes)
app.use('/api', guestRoutes)
app.use('/api', userRoutes)
app.use('/api', reservationRoutes)
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