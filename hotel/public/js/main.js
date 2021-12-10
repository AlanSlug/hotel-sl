//Validar formualario de agregar habitacion
var forms = document.querySelectorAll('#login')
Array.prototype.slice.call(forms)
    .forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            } else {
                event.preventDefault()
                event.stopPropagation()
                var user = document.getElementById('user').value
                var pass = document.getElementById('pass').value
                accs(user, pass)
            }
            form.classList.add('was-validated')
        }, false)
    })

function accs(user, pass) {
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: user, pass: pass })
    })
        .then(response => {
            if (response.status == 200) {
                response.json().then(data => {
                    if (data.usuario) {
                        console.log('Login')
                        localStorage.setItem('usuario', JSON.stringify(data.usuario));
                        location.href ='/home';
                    } else {
                        document.getElementById('errorPass').style.display = 'block'
                        console.log('No')
                    }
                }).catch(err => {
                    console.log('error al agregar ' + err)
                })
            } else {
                response.text().then(text => {
                    console.log('No actualizado ' + text)
                })
            }
        })
        .catch(err => {
            console.log('error ' + JSON.stringify(err))
        })
}