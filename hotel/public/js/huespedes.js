'use strict'

var idHuespedDelete

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
        $('td:eq(4)', row).html("<div class='text-right'><i class='align-middle far fa-eye fa-lg  option-table' onclick = 'verHabitacion(\"" + guest._id + "\")'></i>" +
            "<i class='far fa-edit fa-lg  option-table' onclick = 'cargarmodificarHabitacion(\"" + guest._id + "\")'></i>" +
            "<i class='far fa-trash-alt fa-lg option-table' data-bs-toggle='modal' data-bs-target='#modal-eliminar' onclick = 'idHuespedDelete = \"" + guest._id + "\"'></i></div>"
        )
    }
});

document.getElementById('agregar-huesped').addEventListener("click", function (event) {
    event.preventDefault()
    document.getElementById('contenido').className = 'col-xl-8'
    //document.getElementById('panel-ver-huesped').className = 'card panel-info-none'
    //document.getElementById('panel-modificar-huesped').className = 'card panel-info-none'
    document.getElementById('panel-agregar-huesped').className = 'card panel-info-show'
}, false)

function cerrarPanel () {

}

document.getElementById('boton-eliminar').addEventListener("click", deleteHuesped, false)
function deleteHuesped() {
    fetch('/api/guest/' + idHuespedDelete, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.status == 200) {
            response.json().then(data => {
                cerrarPanel()
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