'use strict'

var GuestSquema = require('../models/guest')

var controller = {
    getGuest: function (req, res) {
        var idGuest = req.params.id
        if (!idGuest) return res.status(404).send({ message: 'No se obtuvo id del huesped' })

        GuestSquema.findById(idGuest, (err, guest) => {
            if (err) return res.status(500).send({ message: 'Error al devolver los datos' + err })
            if (!guest) return res.status(404).send({ message: 'La habitacion no existe' })
            return res.status(200).send({ guest })
        })
    },getGuests: function (req, res) {
        GuestSquema.find({}).exec((err, guests) => {
            if (err) return res.status(500).send({ message: 'Error al devolver los datos' + err })
            if (!guests) return res.status(404).send({ message: 'No hay habitaciones que mostrar' })
            return res.status(200).send({ guests })
        })
    },
    saveGuest: function (req, res) {
        var guest = new GuestSquema()
        var paramsBody = req.body
        guest.nombre = paramsBody.nombre
        guest.apellidoPaterno = paramsBody.apellidoPaterno
        guest.apellidoMaterno = paramsBody.apellidoMaterno
        guest.dirección = paramsBody.dirección
        guest.sexo = paramsBody.sexo
        guest.telefono = paramsBody.telefono
        guest.correo = paramsBody.correo
        guest.observaciones = paramsBody.observaciones

        guest.save((err, guesttStored) => {
            if (err) return res.status(500).send({ message: 'Error al guardar la informacion' + err })
            if (!guesttStored) return res.status(404).send({ message: 'No se pudo guardar la informacion' })
            return res.status(200).send({ guest: guesttStored, body: req.body})
        })
    },
    updateGuest: function (req, res) {
        var guestId = req.params.id
        var updateGuest = req.body
        console.log('update' + JSON.stringify(updateGuest))

        GuestSquema.findByIdAndUpdate(guestId, updateGuest, (err, guesUpdate) => {
            console.log('RES ' + JSON.stringify(guesUpdate))
            if (err) return res.status(500).send({ message: 'Error al actualizar los datos' + err })
            if (!guesUpdate) return res.status(404).send({ message: 'No existe el huesped' })
            return res.status(200).send({ guesUpdate })
        })
    },
    deleteGuest: function (req, res) {
        var guestId = req.params.id

        GuestSquema.findByIdAndDelete(guestId, (err, guestRemoved) => {
            if (err) return res.status(500).send({ message: 'No se pudo borrar el huesped ' + err })
            if (!guestRemoved) return res.status(404).send({ message: 'No existe la huesped' })
            return res.status(200).send({ guestRemoved })
        })
    }
}

module.exports = controller