'use strict'

var idMod
var tablaReservaciones = $('#tabla-reservaciones').DataTable({
    ajax: {
        url: '/api/reservation',
        method: "GET",
        dataSrc: 'reservations'
    },
    columns: [
        { title: "Check-in", data: "checkin" },
        { title: "Check-out", data: "checkout" },
        { title: "Noches", data: "noches" },
        { title: "Huesped", data: "huesped.nombre" },
        { title: "Habitación", data: "habitacion.id" },
        { title: "Costo", data: "costo" },
        { title: "", defaultContent: "" }
    ],
    dom: 'Bfrtip',
    buttons: ["copy", "print"],
    rowCallback: function (row, reservation) {
        $('td:eq(5)', row).html(formatoCifras(reservation.costo))
        $('td:eq(6)', row).html("<div class='text-right'><i class='align-middle far fa-eye fa-lg  option-table' onclick = 'verReservacion(\"" + reservation._id + "\")'></i>" +
            "<i class='far fa-edit fa-lg  option-table' onclick = 'cargarmodificar(\"" + reservation._id + "\")'></i>"
        )
    }
});
ocultarPaneles()

function ocultarPaneles() {
    document.getElementById('nuevaReservacion').className = 'card panel-info-none'
    document.getElementById('modificarReservacion').className = 'card panel-info-none'
    document.getElementById('verReservacion').className = 'card panel-info-none'

    document.getElementById('fechasNueva').value = ""
    document.getElementById('huespedNueva').value = ""
    document.getElementById('habitacionNueva').value = ""
    document.getElementById('numAdultosNueva').value = 1
    document.getElementById('numNinosNueva').value = 0
}

function cargarmodificar(id) {
    ocultarPaneles()
    document.getElementById('panel-reservacion').className = 'col-xl-12 panel-info-show'
    document.getElementById('modificarReservacion').className = 'card panel-info-show'
    idMod = id
    let reservacion = getReservation(id)
    if (reservacion) {
        document.getElementById('fechasModificar').value = reservacion.checkin + ' - ' + reservacion.checkout
        document.getElementById('huespedModificar').value = reservacion.huesped.nombre + ' ' + reservacion.huesped.apellidoPaterno
        document.getElementById('habitacionModificar').value = reservacion.habitacion.id
        document.getElementById('numAdultosModificar').value = reservacion.adultos
        document.getElementById('numNinosModificar').value = reservacion.ninos
        huespedSeleccionada = reservacion.huesped
        habitacionSeleccionada = reservacion.habitacion
    }
}

function verReservacion(id) {
    ocultarPaneles()
    document.getElementById('panel-reservacion').className = 'col-xl-12 panel-info-show'
    document.getElementById('verReservacion').className = 'card panel-info-show'
    let reservacion = getReservation(id)
    if (reservacion) {
        document.getElementById('verFecha').value = reservacion.checkin + ' - ' + reservacion.checkout
        document.getElementById('huespedVer').value = reservacion.huesped.nombre + ' ' + reservacion.huesped.apellidoPaterno
        document.getElementById('habitacionVer').value = reservacion.habitacion.id
        document.getElementById('numAdultosVer').value = reservacion.adultos
        document.getElementById('numNinosVer').value = reservacion.ninos
    }
}

$(function () {
    let fecha = new Date()
    fecha = (fecha.getMonth() + 1) + '/' + fecha.getDate() + '/' + fecha.getFullYear()
    console.log('Fecha ' + fecha)
    $('input[name="datefilter"]').daterangepicker({
        minDate: fecha,
        maxDate: false,
        autoUpdateInput: false,
        locale: {
            cancelLabel: 'Clear'
        }
    });
    $('input[name="datefilter"]').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MMM/YYYY') + ' - ' + picker.endDate.format('DD/MMM/YYYY'));
    });
    $('input[name="datefilter"]').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });
});
var habitacionSeleccionada = {};
var huespedSeleccionada = {};
var data = {}

function cerrarPanel() {
    document.getElementById('panel-reservacion').className = 'col-xl-12 panel-info-none'
    ocultarPaneles()
}

document.getElementById('agregar-reservacion').addEventListener("click", function (event) {
    event.preventDefault()
    ocultarPaneles()
    document.getElementById('panel-reservacion').className = 'col-xl-12 panel-info-show'
    document.getElementById('nuevaReservacion').className = 'card panel-info-show'
}, false)

//validar formulario
var formsAgregar = document.querySelectorAll('#reservacion-formulario')
Array.prototype.slice.call(formsAgregar)
    .forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            } else {
                event.preventDefault()
                event.stopPropagation()
                resumenReservacion('Nueva')
            }
            form.classList.add('was-validated')
        }, false)
    })

var formsModificar = document.querySelectorAll('#modificar-formulario')
Array.prototype.slice.call(formsModificar)
    .forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            } else {
                event.preventDefault()
                event.stopPropagation()
                resumenReservacion('Modificar')
            }
            form.classList.add('was-validated')
        }, false)
    })

function resumenReservacion(acc) {
    let fecha = document.getElementById('fechas' + acc).value.split('-')
    data.checkin = fecha[0]
    data.checkout = fecha[1]
    data.noches = obtenerNoches(data.checkin, data.checkout)
    data.nombrehuesped = document.getElementById('huesped' + acc).value
    data.numHabitacion = document.getElementById('habitacion' + acc).value
    data.adultos = document.getElementById('numAdultos' + acc).value
    data.ninos = document.getElementById('numNinos' + acc).value
    data.costo = habitacionSeleccionada.precio * data.noches
    data.huesped = huespedSeleccionada
    data.habitacion = habitacionSeleccionada

    document.getElementById('checkin').innerHTML = data.checkin
    document.getElementById('checkout').innerHTML = data.checkout
    document.getElementById('huesped').innerHTML = data.nombrehuesped
    document.getElementById('habitacion').innerHTML = data.numHabitacion
    document.getElementById('precio').innerHTML = formatoCifras(data.costo)
    document.getElementById('noches').innerHTML = data.noches
    document.getElementById('adultos').innerHTML = data.adultos
    document.getElementById('ninos').innerHTML = data.ninos
    $("#modalReservacion").modal("show");
}

function obtenerNoches(f1, f2) {
    var aFecha1 = new Date(f1)
    var aFecha2 = new Date(f2)
    var dif = aFecha2 - aFecha1;
    var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
    return dias;
}

document.getElementById('reservaciones').className = 'sidebar-item active'
var tablaHAbitaciones = $('#tabla-habitaciones').DataTable({
    ajax: {
        url: '/api/rooms/',
        method: "GET",
        dataSrc: 'rooms'
    },
    columns: [
        { title: "Id", data: "id" },
        { title: "Tipo de habitación", data: "tipo" },
        { title: "Precio", data: "precio" },
    ], select: {
        style: 'single'
    },
    rowCallback: function (row, room) {
        $('td:eq(2)', row).html(formatoCifras(room.precio))
    }
});

tablaHAbitaciones.on('select', function (e, dt, type, indexes) {
    let rowData = tablaHAbitaciones.rows(indexes).data().toArray();
    document.getElementById("habitacionNueva").value = rowData[0].id
    document.getElementById("habitacionModificar").value = rowData[0].id
    habitacionSeleccionada = rowData[0]
});
tablaHAbitaciones.on('deselect', function (e, dt, type, indexes) {
    document.getElementById("habitacionNueva").value = ''
    document.getElementById("habitacionModificar").value = ''
});

var tablaHuespedes = $('#tabla-huespedes').DataTable({
    ajax: {
        url: '/api/guests/',
        method: "GET",
        dataSrc: 'guests'
    },
    columns: [
        { title: "Nombre", data: "nombre" },
        { title: "Apellido Paterno", data: "apellidoPaterno" },
        { title: "Apellido Materno", data: "apellidoMaterno" },
    ], select: {
        style: 'single'
    }
});
tablaHuespedes.on('select', function (e, dt, type, indexes) {
    let rowData = tablaHuespedes.rows(indexes).data().toArray();
    document.getElementById("huespedNueva").value = rowData[0].nombre + ' ' + rowData[0].apellidoPaterno
    document.getElementById("huespedModificar").value = rowData[0].nombre + ' ' + rowData[0].apellidoPaterno
    huespedSeleccionada = rowData[0]
});
tablaHuespedes.on('deselect', function (e, dt, type, indexes) {
    document.getElementById("huespedNueva").value = ''
    document.getElementById("huespedModificar").value = ''
});

function formatoCifras(monto) {
    let negativo = false
    if (monto < 0) {
        negativo = true
        monto = monto * (- 1)
    }
    monto = monto + ""
    let index = monto.length; // indica en que indice iniciara el formato
    for (let i = monto.length; i > 0; i--) {
        if (monto.charAt(i - 1) == ".") {
            index = i - 1 // se actualiza el incice para que empieze el formato despues del punto decimal
        }
    }
    let c = 0;
    let montoTemp = ""
    if (index > 0) {
        for (let i = index; i > 0; i--) {
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
        let montoTemp = "0"
    }
    let m = ""
    for (let i = montoTemp.length; i > 0; i--) {
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

function modificarReservation() {
    if (data)
        updateReservacion(data)
}

//REST API
function saveReservation() {
    cerrarPanel()
    if (data) {
        fetch('/api/reservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (response.status == 200) {
                    response.json().then(data => {
                        swal("Tarea con exito!", "Se ha registrado la reservación correctamente!", "success");
                        tablaReservaciones.ajax.reload()
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
}

function getReservation(id) {
    let response = {}
    let xhr = new XMLHttpRequest()
    xhr.open("GET", '/api/reservation/' + id, false)
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            response = JSON.parse(xhr.responseText).reservation
        }
    }
    xhr.send();
    return response
}

function updateReservacion(data) {
    fetch('/api/reservation/' + idMod, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify(data)
    })
        .then(response => {
            if (response.status == 200) {
                response.json().then(data => {
                    swal("Tarea con exito!", "Se ha actualizado la reservación correctamente!", "success");
                    tablaReservaciones.ajax.reload()
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