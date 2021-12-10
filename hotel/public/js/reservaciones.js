'use strict'

$(function () {
    let fecha = new Date()
    fecha = (fecha.getMonth()+1) + '/' + fecha.getDate() + '/' + fecha.getFullYear()
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

//validar formulario
var forms = document.querySelectorAll('#reservacion-formulario')
Array.prototype.slice.call(forms)
    .forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            } else {
                event.preventDefault()
                event.stopPropagation()
               alert('Correcto')
            }
            form.classList.add('was-validated')
        }, false)
    })

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
    document.getElementById("habitacionText").value = rowData[0].id
    habitacionSeleccionada =  rowData[0]
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
    document.getElementById("huespedText").value = rowData[0].nombre + ' ' + rowData[0].apellidoPaterno
    huespedSeleccionada = rowData[0]
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