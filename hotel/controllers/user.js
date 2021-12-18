'use strict'

var userSchema = require('../models/user')

var userController = {
    getUser: function (req, res) {
        var idUser = req.params.id
        if (!idUser) return res.status(404).send({ message: 'No se obtuvo id del usuario' })

        userSchema.findById(idUser, (err, user) => {
            if (err) return res.status(500).send({ message: 'Error al devolver los datos ' + err })
            if (!user) return res.status(404).send({ message: 'El usuario no existe ' + err })
            let usuario = usuarioFront(user)
            return res.status(200).send({ usuario })
        })
    }, getUsers: function (req, res) {
        userSchema.find({}).exec((err, users) => {
            if (err) return res.status(500).send({ message: 'Error al devolver los datos ' + err })
            if (!users) return res.status(404).send({ message: 'No hay usuarios' })
            for (let i = 0; i < users.length; i++) {
                users[i] = usuarioFront(users[i])
            }
            return res.status(200).send({ users })
        })
    }, saveUser: function (req, res) {
        var user = new userSchema()
        var paramsBody = req.body
        user.nombre = paramsBody.nombre
        user.apellidoPaterno = paramsBody.apellidoPaterno
        user.apellidoMaterno = paramsBody.apellidoMaterno
        user.alias = paramsBody.alias
        user.imagen = null
        user.perfil = paramsBody.perfil
        user.pass = paramsBody.pass

        user.save((err, userStored) => {
            if (err) return res.status(500).send({ message: 'Error al guardar la informacion' + err })
            if (!userStored) return res.status(404).send({ message: 'No se pudo guardar la informacion' })
            return res.status(200).send({ user: userStored })
        })
    }, login: function (req, res) {
        var paramsBody = req.body

        userSchema.find({ user: paramsBody.user, pass: paramsBody.pass }).exec((err, user) => {
            if (err) return res.status(500).send({ message: 'Error al devolver los datos' + err })
            if (!user || user.length < 1) return res.status(200).send({ message: 'Credenciales incorrectas' })
            let usuario = usuarioFront(user[0])
            req.flash('user', usuario)
            //console.log('Login '+JSON.stringify(req.flash('user')))
            return res.status(200).send({ usuario })
        })
    }
}

function usuarioFront(user) {
    let usuario = {}
    usuario.nombre = user.nombre
    usuario.apellidoPaterno = user.apellidoPaterno
    usuario.apellidoMaterno = user.apellidoMaterno
    usuario.user = user.user
    usuario.imagen = user.imagen
    usuario.perfil = user.perfil
    return usuario
}

module.exports = userController