import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

var app = express();
var server = http.createServer(app);
var io = new Server(server);

var userIds = [];
var queue = [];

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('static'));


app.get('/', function(req, res) {
    
    res.render('index');
});

app.get('/play', function(req, res) {
    res.render('play');
});


server.listen(process.env.PORT || 3000);

io.on('connection', function(socket) {
    console.log('a user connected');
    userIds.push(socket.id);

    socket.on('disconnect', function() {
        console.log('user disconnected');
        userIds.splice(userIds.indexOf(socket.id), 1);
        queue.splice(queue.indexOf(socket.id), 1);
        
    });

    socket.on('chat message', function(msg) {
        io.emit('chat message', msg, socket.id);
    });

    socket.on('joinQueue', function() {
        socket.join('queue');
        queue.push(socket.id);
        io.to('queue').emit('queueInfo', {queueLength: queue.length});
    });

    socket.on('leaveQueue', function() {
        socket.leave('queue');
        queue.splice(queue.indexOf(socket.id), 1);
        io.to('queue').emit('queueInfo', {queueLength: queue.length});
    });

});

setInterval(() => {
    io.emit('time', new Date().toTimeString());
}, 1000);

setInterval(() => {
    for (var id of userIds) {
        io.to(id).emit('data', {onlinePlayers: userIds.length});
    }
}, 50);

