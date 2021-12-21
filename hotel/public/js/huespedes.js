'use strict'
var idHuespedDelete
var idHuespedModificar

var tablaHuespedes = $('#tabla-huespedes').DataTable({
    ajax: {
        url: '/api/guests',
        method: "GET",
        dataSrc: 'guests'
    },
    columns: [
        { title: "Nombre", data: "nombre" },
        { title: "Apellido Paterno", data: "apellidoPaterno" },
        { title: "Apellido Materno", data: "apellidoMaterno" },
        { title: "Correo", data: "correo" },
        { title: "", defaultContent: "" }
    ],
    dom: 'Bfrtip',
    buttons: ["copy", "print"],
    rowCallback: function (row, guest) {
        $('td:eq(4)', row).html("<div class='text-right'><i class='align-middle far fa-eye fa-lg  option-table' onclick = 'verHuesped(\"" + guest._id + "\")'></i>" +
            "<i class='far fa-edit fa-lg  option-table' onclick = 'cargarmodificar(\"" + guest._id + "\")'></i>" +
            "<i class='far fa-trash-alt fa-lg option-table' data-bs-toggle='modal' data-bs-target='#modal-eliminar' onclick = 'idHuespedDelete = \"" + guest._id + "\"'></i></div>"
        )
    }
});

function panelesOcultar() {
    limpiarFormulario('Nuevo')
    limpiarFormulario('Modificar')
    document.getElementById('card-modificarHuesped').className = 'card panel-info-none'
    document.getElementById('card-agregarHuesped').className = 'card panel-info-none'
    document.getElementById('card-verHuesped').className = 'card panel-info-none'
}

function limpiarFormulario(prefijo) {
    let campos = ['nombre', 'paterno', 'materno', 'direccion', 'sexo', 'telefono', 'telefono', 'correo', 'observaciones']
    campos.forEach(campo => {
        document.getElementById(campo + prefijo).value = ''
    });
}

function verHuesped(id) {
    panelesOcultar()
    let huesped = getGuest(id)
    if (huesped) {
        document.getElementById('card-verHuesped').className = 'card panel-info-show'
        document.getElementById('nombreVer').value = huesped.nombre
        document.getElementById('paternoVer').value = huesped.apellidoPaterno
        document.getElementById('maternoVer').value = huesped.apellidoMaterno
        document.getElementById('direccionVer').value = huesped.direccion
        document.getElementById('sexoVer').value = huesped.sexo
        document.getElementById('telefonoVer').value = huesped.telefono
        document.getElementById('correoVer').value = huesped.correo
        document.getElementById('observacionesVer').value = huesped.observaciones
    }
}

function cargarmodificar(id) {
    panelesOcultar()
    idHuespedModificar = id
    let huesped = getGuest(id)
    if (huesped) {
        document.getElementById('card-modificarHuesped').className = 'card panel-info-show'
        document.getElementById('nombreModificar').value = huesped.nombre
        document.getElementById('paternoModificar').value = huesped.apellidoPaterno
        document.getElementById('maternoModificar').value = huesped.apellidoMaterno
        document.getElementById('direccionModificar').value = huesped.direccion
        document.getElementById('sexoModificar').value = huesped.sexo
        document.getElementById('telefonoModificar').value = huesped.telefono
        document.getElementById('correoModificar').value = huesped.correo
        document.getElementById('observacionesModificar').value = huesped.observaciones
    }
}

//validar formulario
var forms = document.querySelectorAll('#mofificar-formulario')
Array.prototype.slice.call(forms)
    .forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            } else {
                event.preventDefault()
                event.stopPropagation()
                updateGuest(getInfoFormulario('Modificar'), idHuespedModificar)
            }
            form.classList.add('was-validated')
        }, false)
    })
var forms = document.querySelectorAll('#nuevo-formulario')
Array.prototype.slice.call(forms)
    .forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            } else {
                event.preventDefault()
                event.stopPropagation()
                saveGuest(getInfoFormulario('Nuevo'))
            }
            form.classList.add('was-validated')
        }, false)
    })

function getInfoFormulario(prefijo) {
    let data = {}
    data.nombre = document.getElementById('nombre' + prefijo).value
    data.apellidoPaterno = document.getElementById('paterno' + prefijo).value
    data.apellidoMaterno = document.getElementById('materno' + prefijo).value
    data.direccion = document.getElementById('direccion' + prefijo).value
    data.sexo = document.getElementById('sexo' + prefijo).value
    data.telefono = document.getElementById('telefono' + prefijo).value
    data.correo = document.getElementById('correo' + prefijo).value
    data.observaciones = document.getElementById('observaciones' + prefijo).value

    return data
}

document.getElementById('agregar-huesped').addEventListener("click", function (event) {
    event.preventDefault()
    panelesOcultar()
    document.getElementById('card-agregarHuesped').className = 'card panel-info-show'
}, false)

document.getElementById('boton-eliminar').addEventListener("click", deleteHuesped, false)

//REST API
function saveGuest(data) {
    fetch('/api/guest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.status == 200) {
                response.json().then(data => {
                    swal("Tarea con exito!", "Se ha registrado el huesped correctamente!", "success");
                    panelesOcultar()
                    swal("Tarea con exito!", "", "success");
                    document.getElementById('nombreNuevo').value = ''
                    document.getElementById('paternoNuevo').value = ''
                    document.getElementById('maternoNuevo').value = ''
                    document.getElementById('sexoNuevo').value = ''
                    document.getElementById('direccionNuevo').value = ''
                    document.getElementById('telefonoNuevo').value = ''
                    document.getElementById('correoNuevo').value = ''
                    document.getElementById('observacionesNuevo').value = ''
                    tablaHuespedes.ajax.reload()
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

function getGuest(id) {
    let response = {}
    let xhr = new XMLHttpRequest()
    xhr.open("GET", '/api/guest/' + id, false)
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            response = JSON.parse(xhr.responseText).guest
        }
    }
    xhr.send();
    return response
}
function deleteHuesped() {
    fetch('/api/guest/' + idHuespedDelete, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.status == 200) {
            response.json().then(data => {
                panelesOcultar()
                tablaHuespedes.ajax.reload()
                swal("Tarea con exito!", "El huesped se ha eliminado correctamente!", "success");
            }).catch(err => {
                console.log('error al eliminar ' + err)
                swal("Algo salio mal!", 'error al eliminar ' + err, "error");
            })
        } else {
            response.text().then(text => {
                console.log('No se pudo elimnar ' + text)
                swal("Algo salio mal!", 'No se pudo elimnar ' + text, "error");
            })
        }
    })
        .catch(err => {
            console.log('error ' + JSON.stringify(err))
            swal("Algo salio mal!", 'error ' + JSON.stringify(err), "error");
        })
}

function updateGuest(data, id) {
    fetch('/api/guest/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify(data)
    })
        .then(response => {
            if (response.status == 200) {
                response.json().then(data => {
                    panelesOcultar()
                    tablaHuespedes.ajax.reload()
                    swal("Tarea con exito!", "El huesped se ha actualizado correctamente!", "success");
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