'use strict'
const url = '/api/'
var idHabitacion

document.getElementById('boton-eliminar').addEventListener("click", deleteRooms, false)
document.getElementById('agregar-habitacion').addEventListener("click", function () {
    document.getElementById('contenido').className = 'col-xl-8'
    document.getElementById('panel-agregar-habitacion').className = 'card panel-info-show'
}, false)
/*document.getElementById('agregar-habitacion').addEventListener("click", function () {
    var response = getRooms()
    //alert('R ' + JSON.stringify(response))
    if (response.status) {
        var rooms = response.rooms.map(function (room) {
            if (room.disponibilidad == 'Libre') room.disponibilidad = "<strong class = 'badge bg-success'>" + room.disponibilidad + "</strong>"
            if (room.disponibilidad == 'Reservada') room.disponibilidad = "<p class = 'badge bg-success'>" + room.disponibilidad + "</p>"
            if (room.disponibilidad == 'No disponible') room.disponibilidad = "<p class = 'badge bg-success'>" + room.disponibilidad + "</p>"
            if (room.disponibilidad == 'Limpieza') room.disponibilidad = "<p class = 'badge bg-success'>" + room.disponibilidad + "</p>"
            room.botones = "<i class='align-middle far fa-eye fa-lg  option-table'></i><i class='far fa-edit fa-lg  option-table'></i><i class='far fa-trash-alt fa-lg option-table' data-bs-toggle='modal' data-bs-target='#modal-eliminar' onclick = 'idHabitacion = \"" + room._id + "\"'></i>"
            //room.botones = "<i class='align-middle far fa-eye fa-lg  option-table'></i><i class='far fa-edit fa-lg  option-table'></i><i class='far fa-trash-alt fa-lg option-table' onclick = 'deleteRoom(\""+room._id+"\")'></i>"
            return room
        });
        //alert(JSON.stringify(rooms))
        var table = $('#tabla-habitaciones').DataTable({
        });
    }
    table.clear();
    table.rows.add(rooms).draw();
}, false)*/

function imprimirTabla() {
    let response = getRooms()
    //alert('R ' + JSON.stringify(response))
    if (response.status) {
        let rooms = response.rooms.map(function (room) {
            room.disponibilidad = "<p class = '" + getClassDisponibilidad(room.disponibilidad) + "'>" + room.disponibilidad + "</p>"
            room.botones = "<i class='align-middle far fa-eye fa-lg  option-table' onclick = 'verHabitacion(\"" + room._id + "\")'></i>" +
                "<i class='far fa-edit fa-lg  option-table'></i>" +
                "<i class='far fa-trash-alt fa-lg option-table' data-bs-toggle='modal' data-bs-target='#modal-eliminar' onclick = 'idHabitacion = \"" + room._id + "\"'></i>"
            //room.botones = "<i class='align-middle far fa-eye fa-lg  option-table'></i><i class='far fa-edit fa-lg  option-table'></i><i class='far fa-trash-alt fa-lg option-table' onclick = 'deleteRoom(\""+room._id+"\")'></i>"
            return room
        });
        //alert(JSON.stringify(rooms))
        $('#tabla-habitaciones').DataTable({
            paging: true,
            searching: true,
            info: true,
            data: rooms,
            responsive: true,
            lengthChange: !1,
            columns: [
                { title: "Id", data: "id" },
                { title: "Tipo de habitación", data: "tipo" },
                { title: "Disponibilidad", data: "disponibilidad" },
                { title: "Precio", data: "precio" },
                { title: "", data: "botones" }
            ],
            dom: 'Bfrtip',
            buttons: ["copy", "print"]
        });
    }
}

function cerrarPanel() {
    document.getElementById('contenido').className = 'col-xl-12'
    document.getElementById('panel-ver-habitacion').className = 'card panel-info-none'
    document.getElementById('panel-modificar-habitacion').className = 'card panel-info-none'
    document.getElementById('panel-agregar-habitacion').className = 'card panel-info-none'
}

function verHabitacion(id) {
    let response = getRoom(id)
    if (response.status) {
        document.getElementById('contenido').className = 'col-xl-8'
        document.getElementById('panel-ver-habitacion').className = 'card panel-info-show'

        document.getElementById('ver-numero-habitacion').innerHTML = response.room.id
        document.getElementById('ver-descripcion').innerHTML = response.room.descripcion
        document.getElementById('ver-disponibilidad').innerHTML = response.room.disponibilidad
        document.getElementById("ver-disponibilidad").className = getClassDisponibilidad(response.room.disponibilidad)
        document.getElementById('ver-tipo-habitacion').innerHTML = response.room.tipo
        document.getElementById('ver-precio').innerHTML = response.room.precio


        let elemento = document.getElementById("ver-servicios");
        while (elemento.firstChild) {
            elemento.removeChild(elemento.firstChild);
        }

        if (response.room.servicios && response.room.servicios.length > 0) {
            response.room.servicios.map(function (servicio) {
                let icon
                let text
                if (servicio == 'tv') { icon = 'fas fa-tv'; text = ' TV' }
                if (servicio == 'spa') { icon = 'fas fa-spa'; text = ' SPA' }
                if (servicio == 'shower') { icon = 'fas fa-shower'; text = ' Agua Caliente' }
                if (servicio == 'gym') { icon = 'fas fa-dumbbell'; text = ' GYM' }
                if (servicio == 'jacuzzi') { icon = 'fas fa-hot-tub'; text = ' Jacuzzi' }
                if (servicio == 'pet') { icon = 'fas fa-paw'; text = ' Pet friendly' }
                if (servicio == 'alberca') { icon = 'fas fa-swimming-pool'; text = 'Alberca' }
                if (servicio == 'calefaccion') { icon = 'fas fa-temperature-high'; text = ' Calefaccion' }
                if (servicio == 'wifi') { icon = 'fas fa-wifi'; text = ' Wifi' }

                let Li1 = document.createElement("li")
                Li1.className = "mb-1"
                let Li2 = document.createElement("li")
                Li2.className = icon
                let span = document.createElement("span")
                let t = document.createTextNode(text)
                span.appendChild(t)
                Li2.appendChild(span)
                Li1.appendChild(Li2)
                document.getElementById("ver-servicios").append(Li1);
            })
        }
    }
}

function getClassDisponibilidad(disponibilidad) {
    if (disponibilidad == 'Libre') return 'badge bg-success'
    if (disponibilidad == 'Reservada') return 'badge bg-warning'
    if (disponibilidad == 'No disponible') return 'badge bg-danger'
    if (disponibilidad == 'Limpieza') return 'badge bg-primary'
}

document.getElementById('guardar-habitacion').addEventListener("click", validarGuardar, false)
function validarGuardar() {
    let numeroHabitacion = document.getElementById('numero-habitacion').value
    let disponibilidad = document.getElementById('disponibilidad').value
    let tipoHabitacion = document.getElementById('tipo-habitacion').value
    let precio = document.getElementById('precio-habitacion').value
    precio = parseFloat(precio.slice(2, precio.length))
    let descripcion = document.getElementById('descripcion').value
    if (precio && precio > 0 && descripcion && numeroHabitacion) {
        let servicios = []
        if (document.getElementById('wifi').checked) servicios.push('wifi')
        if (document.getElementById('tv').checked) servicios.push('tv')
        if (document.getElementById('spa').checked) servicios.push('spa')
        if (document.getElementById('shower').checked) servicios.push('shower')
        if (document.getElementById('gym').checked) servicios.push('gym')
        if (document.getElementById('jacuzzi').checked) servicios.push('jacuzzi')
        if (document.getElementById('calefaccion').checked) servicios.push('calefaccion')
        if (document.getElementById('pet').checked) servicios.push('pet')
        if (document.getElementById('alberca').checked) servicios.push('alberca')
        let data = {
            id: numeroHabitacion,
            tipo: tipoHabitacion,
            servicios: servicios,
            disponibilidad: disponibilidad,
            imagen: null,
            descripcion: descripcion,
            precio: precio
        }
        saveRoom(data)
    } else {
        alert('campos requeridos')
    }
}

/**CALL REST API**/
function getRoom(id) {
    let response = {}
    response.status = false
    response.rooms = {}
    let xhr = new XMLHttpRequest()
    xhr.open("GET", url + 'room/' + id, false)
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let room = JSON.parse(xhr.responseText).room
            response.status = true
            response.room = room
        }
    }
    xhr.send();
    return response
}

function getRooms() {
    let response = {}
    response.status = false
    response.rooms = {}
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let rooms = JSON.parse(xhr.responseText).rooms
            response.status = true
            response.rooms = rooms
        }
    }
    xhr.open("GET", url + 'rooms', false)
    xhr.send();
    return response
}

function deleteRooms(idRoom) {
    let response = {}
    response.status = false
    response.rooms = {}
    let xhr = new XMLHttpRequest()
    xhr.open("DELETE", url + 'delete-room/' + idHabitacion, false)
    xhr.onreadystatechange = function () {
        console.log('readyState ' + xhr.readyState + ' status ' + xhr.status)
        if (xhr.readyState == 4 && xhr.status == 200) {
            window.location.reload(true)
        } else {
            alert('Ocurrio un error al eliminar la habitacion')
        }
    }
    xhr.send();
    return response
}

function saveRoom(data) {
    let apiUrl = url + '/save-room'
    console.log('ObjectRoom' + JSON.stringify(data))
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response =>
            response.json()
        ).then(data => {
            console.log(data)
        })
}