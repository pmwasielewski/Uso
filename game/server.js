import generateTargets from './generateTargets.js';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

var app = express();
var server = http.createServer(app);
var io = new Server(server);

var usersOnline = [];
var queue = [];
var games = [];
var gameId = 0;

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

function leaveQueue(socket) {
    return () => {
        socket.leave('queue');
        queue.splice(queue.indexOf(socket), 1);
        io.to('queue').emit('queueInfo', {queueLength: queue.length});
    };
    
}

function userQuit(socket) {
    return () => {
        console.log('user disconnected');
        usersOnline.splice(usersOnline.indexOf(socket), 1);
        queue.splice(queue.indexOf(socket), 1);
    };
}

function startGame(socket, game) {
    var path = 'gameData/targets' + game.id + '.json'
    generateTargets(2, 5, './static/' + path);
    game.path = './' + path;
    socket.emit('startGame', game);
}

io.on('connection', function(socket) {
    console.log('a user connected');
    usersOnline.push(socket);

    socket.on('disconnect', userQuit(socket));

    // socket.on('chat message', function(msg) {
    //     io.emit('chat message', msg, socket.id);
    // });

    socket.on('joinQueue', function() {
        socket.join('queue');
        queue.push(socket);
        io.to('queue').emit('queueInfo', {queueLength: queue.length});
    });

    socket.on('leaveQueue', leaveQueue(socket));

});

setInterval(() => {
    io.emit('time', new Date().toTimeString());
}, 1000);


//aktualizacja stanu serwera
setInterval(() => {
    //wysyłanie do graczy ich informacji
    for (var userSocket of usersOnline) {
        userSocket.emit('data', {onlinePlayers: usersOnline.length});
    }

    //sprawdzanie czy są gracze w kolejce
    if (queue.length >= 2) {
        console.log('creating game');
        games.push({players: [queue[0].id, queue[1].id]}); //tu mozna zmienic na nick czy cos
        var PlayersSocket = [queue[0], queue[1]];
        var currentGame = games[games.length-1];
        currentGame.id = gameId++;
        for (var PlayerSocket of PlayersSocket) {
            leaveQueue(PlayerSocket)();
            startGame(PlayerSocket, currentGame);
        }
    }
}, 50);

