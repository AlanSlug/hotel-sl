const url = 'http://localhost:3700/api/'

var apiRest = {
    getRooms: function () {
        var response = {}
        response.status = false
        var xhr = new XMLHttpRequest()
        xhr.open("GET", url + '/rooms', true)
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var rooms = JSON.parse(xhr.responseText).rooms
                response.status = true
                response.rooms = rooms
            }
        }
        return response
    }
}