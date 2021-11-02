'use strict'

//var roomSquema = require('../models/room')

var controller = {
    guest: function (req, res) {
        return res.status(200).send({
            message: 'Soy home'
        }) 
    }
}

module.exports = controller