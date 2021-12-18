'use strict'
var ReservationSchema = require('../models/reservation')

var reservationController = {
    getReservations: function (req, res) {
        ReservationSchema.find({}).exec((err, reservations) => {
            if (err) return res.status(500).send({ message: 'Error al devolver los datos ' + err })
            if (!reservations) return res.status(404).send({ message: 'No hay reservasiones' })
            return res.status(200).send({ reservations })
        })
    },
    getReservation : function (req, res) {
        var idReservation = req.params.id
        if (!idReservation) return res.status(404).send({ message: 'No se obtuvo id de la reservacion' })

        ReservationSchema.findById(idReservation, (err, reservation) => {
            if (err) return res.status(500).send({ message: 'Error al devolver los datos ' + err })
            if (!reservation) return res.status(404).send({ message: 'La reservasion no existe ' + err })
            return res.status(200).send({ reservation })
        })
    }, saveReservation: function (req, res) {
        var reservation = new ReservationSchema()
        var paramsBody = req.body
        reservation.checkin = paramsBody.checkin
        reservation.checkout = paramsBody.checkout
        reservation.huesped = paramsBody.huesped
        reservation.habitacion = paramsBody.habitacion
        reservation.adultos = paramsBody.adultos
        reservation.ninos = paramsBody.ninos
        reservation.costo = paramsBody.costo
        reservation.recepcionista = paramsBody.recepcionista
        reservation.noches = paramsBody.noches
        
        reservation.save((err, reservationStored) => {
            if (err) return res.status(500).send({ message: 'Error al guardar la informacion' + err })
            if (!reservationStored) return res.status(404).send({ message: 'No se pudo guardar la informacion' })
            return res.status(200).send({ reservation: reservationStored })
        })
    },updateReservation: function (req, res) {
        var reservationId = req.params.id
        var updateReservation = req.body

        ReservationSchema.findByIdAndUpdate(reservationId, updateReservation, (err, reservationUpdate) => {
            if (err) return res.status(500).send({ message: 'Error al actualizar los datos' + err })
            if (!reservationUpdate) return res.status(404).send({ message: 'No existe la habitacion' })
            return res.status(200).send({ reservationUpdate })
        })
    },deleteReservation: function (req, res) {
        var reservationId = req.params.id

        ReservationSchema.findByIdAndDelete(reservationId, (err, reservatioRemoved) => {
            if (err) return res.status(500).send({ message: 'No se pudo borrar la reservasion ' + err })
            if (!reservatioRemoved) return res.status(404).send({ message: 'No existe la reservasion' })
            return res.status(200).send({ reservatioRemoved })
        })
    }
}

module.exports = reservationController