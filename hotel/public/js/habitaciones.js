'use strict'
//Validar formualario de agregar habitacion
var forms = document.querySelectorAll('#agregar')
Array.prototype.slice.call(forms)
    .forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            } else {
                event.preventDefault()
                event.stopPropagation()
                guardarHabitacion()
            }
            form.classList.add('was-validated')
        }, false)
    })

//Validar formualario de modificar habitacion
var forms = document.querySelectorAll('#modificar')
Array.prototype.slice.call(forms)
    .forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            } else {
                event.preventDefault()
                event.stopPropagation()
                modificarHabitacion()
            }
            form.classList.add('was-validated')
        }, false)
    })

//const url = 'https://apirest-hotel.herokuapp.com/api' 
//const url = 'http://localhost:3000/api'
var idHabitacionDelete //guarda el id de la habitacion para eliminar
var idHabitacionModificar //guarda el id de la habitacion para eliminar

document.getElementById('boton-eliminar').addEventListener("click", deleteRooms, false)

document.getElementById('agregar-habitacion').addEventListener("click", function (event) {
    event.preventDefault()
    document.getElementById('contenido').className = 'col-xl-8'
    document.getElementById('panel-ver-habitacion').className = 'card panel-info-none'
    document.getElementById('panel-modificar-habitacion').className = 'card panel-info-none'
    document.getElementById('panel-agregar-habitacion').className = 'card panel-info-show'
}, false)

var tablaHAbitaciones = $('#tabla-habitaciones').DataTable({
    ajax: {
        url: '/api/rooms/',
        method: "GET",
        dataSrc: 'rooms'
    },
    columns: [
        { title: "Id", data: "id" },
        { title: "Tipo de habitación", data: "tipo" },
        { title: "Disponibilidad", data: "disponibilidad" },
        { title: "Precio", data: "precio" },
        { title: "", defaultContent: "" }
    ],
    dom: 'Bfrtip',
    buttons: ["copy", "print"],
    rowCallback: function (row, room) {
        $('td:eq(2)', row).html("<p class = '" + getClassDisponibilidad(room.disponibilidad) + "'>" + room.disponibilidad + "</p>")
        $('td:eq(3)', row).html(formatoCifras(room.precio))
        $('td:eq(4)', row).html("<div class='text-right'><i class='align-middle far fa-eye fa-lg  option-table' onclick = 'verHabitacion(\"" + room._id + "\")'></i>" +
            "<i class='far fa-edit fa-lg  option-table' onclick = 'cargarmodificarHabitacion(\"" + room._id + "\")'></i>" +
            "<i class='far fa-trash-alt fa-lg option-table' data-bs-toggle='modal' data-bs-target='#modal-eliminar' onclick = 'idHabitacionDelete = \"" + room._id + "\"'></i></div>"
        )
    }
});

function cerrarPanel() {
    document.getElementById('contenido').className = 'col-xl-12'
    document.getElementById('panel-ver-habitacion').className = 'card panel-info-none'
    document.getElementById('panel-modificar-habitacion').className = 'card panel-info-none'
    document.getElementById('panel-agregar-habitacion').className = 'card panel-info-none'
}

function cargarmodificarHabitacion(id) {
    let response = getRoom(id)
    if (response.status) {
        idHabitacionModificar = response.room._id
        document.getElementById('contenido').className = 'col-xl-8'
        document.getElementById('panel-modificar-habitacion').className = 'card panel-info-show'
        document.getElementById('panel-ver-habitacion').className = 'card panel-info-none'
        document.getElementById('panel-agregar-habitacion').className = 'card panel-info-none'

        document.getElementById('tittle-modificar').innerHTML = 'Modificar habitación ' + response.room.id
        document.getElementById('mod-numero-habitacion').value = response.room.id
        document.getElementById('mod-descripcion').innerHTML = response.room.descripcion
        document.getElementById('mod-precio-habitacion').value = response.room.precio

        for (let i = 0; i < document.getElementById('mod-disponibilidad').children.length; i++) {
            if (document.getElementById('mod-disponibilidad').children[i].value == response.room.disponibilidad) {
                document.getElementById('mod-disponibilidad').children[i].selected = true;
                break
            }
        }
        for (let i = 0; i < document.getElementById('mod-tipo-habitacion').children.length; i++) {
            if (document.getElementById('mod-tipo-habitacion').children[i].value == response.room.tipo) {
                document.getElementById('mod-tipo-habitacion').children[i].selected = true;
                break
            }
        }

        if (response.room.servicios && response.room.servicios.length > 0) {
            response.room.servicios.map(function (servicio) {
                document.getElementById('mod-' + servicio).checked = true
            })
        }
    }
}

function verHabitacion(id) {
    let response = getRoom(id)
    if (response.status) {
        document.getElementById('contenido').className = 'col-xl-8'
        document.getElementById('panel-ver-habitacion').className = 'card panel-info-show'
        document.getElementById('panel-modificar-habitacion').className = 'card panel-info-none'
        document.getElementById('panel-agregar-habitacion').className = 'card panel-info-none'

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
//document.getElementById('mod-habitacion').addEventListener("click", modificarHabitacion, false)
function modificarHabitacion() {
    let validacion = validarGuardar(true)
    if (validacion) {
        updateRoom(validacion, idHabitacionModificar)
    } else {
        alert('Campos requeridos')
    }
}

//document.getElementById('guardar-habitacion').addEventListener("click", guardarHabitacion, false)
function guardarHabitacion() {
    let validacion = validarGuardar(false)
    if (validacion) {
        saveRoom(validacion)
    } else {
        alert('Campos requeridos')
    }
}

function validarGuardar(modificar) {
    let data
    let prefijo = (modificar) ? 'mod-' : ''
    let numeroHabitacion = document.getElementById(prefijo + 'numero-habitacion').value
    let disponibilidad = document.getElementById(prefijo + 'disponibilidad').value
    let tipoHabitacion = document.getElementById(prefijo + 'tipo-habitacion').value
    let precio = document.getElementById(prefijo + 'precio-habitacion').value
    precio = parseFloat(precio.slice(2, precio.length))
    let descripcion = document.getElementById(prefijo + 'descripcion').value
    if (precio && precio > 0 && descripcion && numeroHabitacion) {
        let servicios = []
        if (document.getElementById(prefijo + 'wifi').checked) servicios.push('wifi')
        if (document.getElementById(prefijo + 'tv').checked) servicios.push('tv')
        if (document.getElementById(prefijo + 'spa').checked) servicios.push('spa')
        if (document.getElementById(prefijo + 'shower').checked) servicios.push('shower')
        if (document.getElementById(prefijo + 'gym').checked) servicios.push('gym')
        if (document.getElementById(prefijo + 'jacuzzi').checked) servicios.push('jacuzzi')
        if (document.getElementById(prefijo + 'calefaccion').checked) servicios.push('calefaccion')
        if (document.getElementById(prefijo + 'pet').checked) servicios.push('pet')
        if (document.getElementById(prefijo + 'alberca').checked) servicios.push('alberca')
        data = {
            id: numeroHabitacion,
            tipo: tipoHabitacion,
            servicios: servicios,
            disponibilidad: disponibilidad,
            imagen: null,
            descripcion: descripcion,
            precio: precio
        }
    } else {
        data = false
    }
    return data
}

function formatoCifras(monto) {
    var negativo = false
    if (monto < 0) {
        negativo = true
        monto = monto * (- 1)
    }
    monto = monto + ""
    var index = monto.length; // indica en que indice iniciara el formato
    for (var i = monto.length; i > 0; i--) {
        if (monto.charAt(i - 1) == ".") {
            index = i - 1 // se actualiza el incice para que empieze el formato despues del punto decimal
        }
    }
    var c = 0;
    var montoTemp = ""
    if (index > 0) {
        for (var i = index; i > 0; i--) {
            montoTemp += monto.charAt(i - 1)
            c++
            if (c == 3) {
                if (i != 1) {
                    montoTemp += ","
                    c = 0
                }
            }
        }
    } else {
        var montoTemp = "0"
    }
    var m = ""
    for (var i = montoTemp.length; i > 0; i--) {
        m += montoTemp.charAt(i - 1)
    }
    if (index != monto.length) {// agrega los decimales al resultado
        m += monto.substring(index, monto.length)
    } else {
        m += ".00"
    }
    if (negativo) {
        m = "-" + m
    }
    return "$" + m
}

/**CALL REST API**/
function updateRoom(data, id) {
    fetch('/api/update-room/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify(data)
    })
        .then(response => {
            if (response.status == 200) {
                response.json().then(data => {
                    cerrarPanel()
                    tablaHAbitaciones.ajax.reload()
                    swal("Tarea con exito!", "La habitación se ha actualizado correctamente!", "success");
                    console.log('Habitacion actualizada ' + JSON.stringify(data))
                }).catch(err => {
                    console.log('error al actualizar ' + err)
                    swal("Algo salio mal!", 'error al actualizar ' + err, "error");
                })
            } else {
                response.text().then(text => {
                    console.log('No actualizado ' + text)
                    swal("Algo salio mal!", 'No actualizado ' + text, "error");
                })
            }
        })
        .catch(err => {
            console.log('error ' + JSON.stringify(err))
            swal("Algo salio mal!", 'error ' + JSON.stringify(err), "error");
        })
}

function getRoom(id) {
    let response = {}
    response.status = false
    response.rooms = {}
    let xhr = new XMLHttpRequest()
    xhr.open("GET", '/api/room/' + id, false)
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
    xhr.open("GET", '/api/rooms', false)
    xhr.send();
    return response
}

function deleteRooms(idRoom) {
    let response = {}
    response.status = false
    response.rooms = {}
    let xhr = new XMLHttpRequest()
    xhr.open("DELETE", '/api/delete-room/' + idHabitacionDelete, false)
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            tablaHAbitaciones.ajax.reload()
            cerrarPanel()
            swal("Tarea con exito!", "La habitación se ha eliminado correctamente!", "success");
        } else {
            swal("Algo salio mal!", 'Ocurrio un error al eliminar la habitacion', "error");
        }
    }
    xhr.send();
    return response
}

function saveRoom(data) {
    fetch('/api/save-room', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.status == 200) {
                response.json().then(data => {
                    swal({
                        title: "Tarea con exito!",
                        text: "La habitación ha agregado correctamente!",
                        icon: "success",
                        buttons: {
                            catch: {
                                text: "Agregar otra habitación",
                                value: "catch",
                            },
                            cancel: "Finalizar!"
                        }
                    })
                        .then((value) => {
                            switch (value) {
                                case "catch":
                                    swal("Mensaje!", "Continua agregando habitaciones", "info");
                                    break;

                                default:
                                    cerrarPanel()
                                    swal("Tarea con exito!", "", "success");
                                    document.getElementById('numero-habitacion').value = ''
                                    document.getElementById('descripcion').value = ''
                                    document.getElementById('precio-habitacion').value = null
                                    document.getElementById('disponibilidad').children[0].selected = true;
                                    document.getElementById('tipo-habitacion').children[0].selected = true;
                                    document.getElementById('wifi').checked = false
                                    document.getElementById('tv').checked = false
                                    document.getElementById('spa').checked = false
                                    document.getElementById('shower').checked = false
                                    document.getElementById('gym').checked = false
                                    document.getElementById('jacuzzi').checked = false
                                    document.getElementById('calefaccion').checked = false
                                    document.getElementById('pet').checked = false
                                    document.getElementById('alberca').checked = false
                            }
                        });
                    tablaHAbitaciones.ajax.reload()
                }).catch(err => {
                    console.log('error al agregar ' + err)
                    swal("Algo salio mal!", 'error al agregar ' + err, "error");
                })
            } else {
                response.text().then(text => {
                    console.log('No actualizado ' + text)
                    swal("Algo salio mal!", 'No actualizado ' + text, "error");
                })
            }
        })
        .catch(err => {
            console.log('error ' + JSON.stringify(err))
            swal("Algo salio mal!", 'error ' + JSON.stringify(err), "error");
        })
}