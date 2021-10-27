'use strict'

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

//Cargar archivos de rutas
const roomRoutes = require('./routes/room')

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

//Rutas
//app.use('/api', roomRoutes)
app.use(express.static(path.join(__dirname, 'public')))


app.get('/', (req,res) => {
    res.status(200).send(
        "<H1>Pagina inicio API</H1>"
    )
})
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
//Exportar
module.exports = app