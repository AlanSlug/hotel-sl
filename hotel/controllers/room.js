'use strict'

var roomSquema = require('../models/room')
var fs = require('fs')
var controller = {
    home: function (req, res) {
        return res.status(200).send({
            message: 'Soy home'
        })
    },
    test: function (req, res) {
        return res.status(200).send({
            message: 'Soy el metodo test de room'
        })
    },
    saveRoom: function (req, res) {
        var room = new roomSquema()
        var paramsBody = req.body
        room.id = paramsBody.id
        room.tipo = paramsBody.tipo
        room.servicios = paramsBody.servicios
        room.descripcion = paramsBody.descripcion
        room.disponibilidad = paramsBody.disponibilidad
        room.precio = paramsBody.precio
        room.imagen = null

        room.save((err, roomtStored) => {
            if (err) return res.status(500).send({ message: 'Error al guardar la informacion' + err })
            if (!roomtStored) return res.status(404).send({ message: 'No se pudo guardar la informacion' })
            return res.status(200).send({ room: roomtStored })
        })
    },
    getRoom: function (req, res) {
        var roomId = req.params.id
        if (!roomId) return res.status(404).send({ message: 'No se obtuvo id de la habitacion' })

        roomSquema.findById(roomId, (err, room) => {
            if (err) return res.status(500).send({ message: 'Error al devolver los datos' + err })
            if (!room) return res.status(404).send({ message: 'La habitacion no existe' })
            return res.status(200).send({ room })
        })
    },
    getRooms: function (req, res) {
        roomSquema.find({}).exec((err, rooms) => {
            if (err) return res.status(500).send({ message: 'Error al devolver los datos' + err })
            if (!rooms) return res.status(404).send({ message: 'No hay habitaciones que mostrar' })
            return res.status(200).send({ rooms })
        })
    },
    updateRoom: function (req, res) {
        var roomId = req.params.id
        var updateRoom = req.body
        console.log('update' + JSON.stringify(updateRoom))

        roomSquema.findByIdAndUpdate(roomId, updateRoom, (err, roomUpdate) => {
            console.log('RES ' + JSON.stringify(roomUpdate))
            if (err) return res.status(500).send({ message: 'Error al actualizar los datos' + err })
            if (!roomUpdate) return res.status(404).send({ message: 'No existe la habitacion' })
            return res.status(200).send({ roomUpdate })
        })
    },
    deleteRoom: function (req, res) {
        var roomId = req.params.id

        roomSquema.findByIdAndDelete(roomId, (err, roomRemoved) => {
            if (err) return res.status(500).send({ message: 'No se pudo borrar la habitacion ' + err })
            if (!roomRemoved) return res.status(404).send({ message: 'No existe la habitacion' })
            return res.status(200).send({ roomRemoved })
        })
    }, uploadImage: function (req, res) {
        var roomId = req.params.id
        var fileName = 'Imagen no subida'
        var fileNameOld = ''

        if (req.files) {

            var filePath = req.files.image.path
            fileName = filePath.split('\\')[1]
            var extFile = fileName.split('\.')[1]
            if (extFile == 'png' || extFile == 'jpg' || extFile == 'jpeg' || extFile == 'gif') {
                roomSquema.findById(roomId, (err, room) => {//buscar archivo antigua para borrarlo
                    if (err || !room) console.log('No se obtuvo id de la habitacion para borrar imagen antigua')
                    if (room.imagen) fileNameOld = room.imagen
                })
                roomSquema.findByIdAndUpdate(roomId, { imagen: fileName }, { new: true }, (err, roomUpdated) => {
                    if (err) {
                        console.log('Imagen borrada por error en encontrar la habitacion ' + err)
                        deleteFiles(fileName)//Borra el archivo imagen para no generar basura y archivos huerfanos
                        return res.status(500).send({ message: 'La imagen no se ha subido ' + err })
                    }
                    if (!roomUpdated) {
                        console.log('Imagen borrada por error en encontrar la habitacion ' + err)
                        deleteFiles(fileName)
                        return res.status(404).send({ message: 'El proyecto no existe' })
                    }
                    if (fileNameOld) deleteFiles(fileNameOld)
                    return res.status(200).send({ roomUpdated })
                })
            } else {
                deleteFiles(fileName)
                return res.status(200).send({ message: 'Extencion no valida para el archivo' })
            }
        } else {
            return res.status(200).send({ message: fileName })
        }
    }
}

function deleteFiles(nameFile) {
    try {
        fs.unlinkSync('./uploads/' + nameFile)
    } catch (error) {
        console.error('No se pudo borrar la imagen ' + error)
    }
}

module.exports = controller