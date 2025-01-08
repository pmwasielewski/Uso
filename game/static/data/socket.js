export default class Socket {

    static configureSocket() {
        var socket = io();
        socket.on('time', function(data) {
            //console.log(data);
        });

        socket.on('data', function(data) {
            //console.log(data);
        });
    }
}