import generateTargets from './generateTargets.js';
import express from 'express';
import http from 'http';
import pkg from 'pg';
const { Pool } = pkg;
import { Server } from 'socket.io';
import { createPool, listUsers, addUser, getUserPassword, checkNickExists} from './db.js';
import authorize from './authorize.js';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import config from './config.js';

const pool = createPool();
var app = express();
var server = http.createServer(app);
var io = new Server(server);

var usersOnline = [];
var usersData = {};
var queue = [];
var games = [];
var gameId = 0;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('static'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.COOKIE_SEED));

app.get('/', authorize, function(req, res) {
    res.render('index', {
        user: req.user,
        leaderboard: [
            { name: "Player1", time: 120 },
            { name: "Player2", time: 125 },
            { name: "Player3", time: 130 },
            { name: "Player4", time: 135 },
            { name: "Player5", time: 140 }
        ]
    });
});

app.get('/login', function(req, res) { 
    res.render('login');
});

app.get('/register', function(req, res) { 
    res.render('register');
});

app.post('/login', async (req, res) => {
    var username = req.body.txtUser;
    var pwd = req.body.txtPwd;

    const userPassword = await getUserPassword(pool, username);
    var result = await bcrypt.compare(pwd, userPassword);

    if (result) {
        res.cookie('user', username, { signed: true });
        var returnUrl = req.query.returnUrl;
        if (returnUrl){
            res.redirect(returnUrl);
        }else{
            res.redirect('/')
        }
        
    } else {
        res.render('login', { message: "Zła nazwa logowania lub hasło" });
    }
});

app.post('/register', async (req, res) => {
    var username = req.body.txtUser;
    var pwd = req.body.txtPwd;

    if (username.length >= 15) {
        return res.render('register', { message: "Nick nie może być dłuższy niż 15 znaków." });
    }

    var check = await checkNickExists(pool, username)
    if (check) {
        return res.render('register', { message: "Użytkownik o podanym nicku już istnieje." });
    }

    var rounds = 12;
    var hash = await bcrypt.hash(pwd, rounds);

    await addUser(pool, username, hash);

    res.redirect('login');

});

app.get( '/logout', authorize, (req, res) => {
    res.cookie('user', '', { maxAge: -1 } );
    res.redirect('/')
    });


app.get('/play', authorize, function(req, res) {
    res.render('play', { user : req.user });
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
    game.playersEnded = 0;
    game.scores = [];
    usersData[socket.id].game = game;
    //socket.emit('startGame', game);
    socket.join(game.id);
}

io.on('connection', function(socket) {
    console.log('a user connected');
    usersOnline.push(socket);
    usersData[socket.id] = {};

    //RTT calculation
    socket.on('pong', function(data) {
        usersData[socket.id].ping = Date.now() - data;
    });


    socket.on('disconnect', userQuit(socket));

    // socket.on('chat message', function(msg) {
    //     io.emit('chat message', msg, socket.id);
    // });

    socket.on('joinQueue', function() {
        socket.join('queue');
        queue.push(socket);
    });

    socket.on('leaveQueue', leaveQueue(socket));

    socket.on('endGame', function(points) {
        console.log('player ended game with ' + points + ' points');
        usersData[socket.id].points = points;
        //zapis do bazy
        var game = games.find(game => game.players.includes(socket.id));
        game.playersEnded++;
        game.scores.push({id: socket.id, points: points});
        game.scores.sort((a, b) => b.points - a.points);
        //io.to(game.id).emit('gameEnd', game.scores);

        if (game.playersEnded == game.players.length) {
            game.gameEnded = true;
            games.splice(games.indexOf(game), 1);
            //usuwanie graczy z pokoju
            for (var player of game.players) {
                var playerSocket = usersOnline.find(user => user.id == player);
                playerSocket.leave(game.id);
            }
        }
    });

});

function sendDataToPlayers() {
    for (var userSocket of usersOnline) {
        var userData = usersData[userSocket.id];
        userData.onlinePlayers = usersOnline.length;
        userData.serverTime = Date.now();
        if (queue.includes(userSocket)) {
            userData.queueLength = queue.length;
        }
        
        userSocket.emit('userData', userData);
    }
}

function checkQueue() {
    if (queue.length >= 2) {
        console.log('creating game');
        games.push({players: [queue[0].id, queue[1].id]}); //tu mozna zmienic na nick czy cos
        var PlayersSocket = [queue[0], queue[1]];
        var currentGame = games[games.length-1];
        currentGame.id = 'game' + gameId;
        gameId++;
        for (var PlayerSocket of PlayersSocket) {
            leaveQueue(PlayerSocket)();
            startGame(PlayerSocket, currentGame);
        }
        io.to(currentGame.id).emit('startGame', currentGame);
    }
}

function RTT() {
    for (var userSocket of usersOnline) {
        userSocket.emit('ping', Date.now());
    }
}

var loopCounter = 0;
const sheduler = setInterval(() => {
    if (loopCounter % 2 == 0) { //every 200ms
        RTT();
    }
    if (loopCounter % 5 == 0) { //every 500ms
        sendDataToPlayers();
    }
    if (loopCounter % 10 == 0) { //every 1s
        checkQueue();
    }
    loopCounter++;
}, 100);