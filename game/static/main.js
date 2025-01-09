import Game from './states/game.js';
import Socket from './data/socket.js';
import Menu from './states/menu.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
var mouseCoords = {x: 0, y: 0};
var time = 0;
// canvas size: 800x600
var states = {menu: new Menu(canvas.width, canvas.height), queue: null, game: null, end: null};
var currentState = states.menu; //testy
var gameInfo = {onlinePlayers: 0};
var MenuOptionsToChoose = {'Quick start': 0, 'leaveQueue': 0};
var socket = io();

window.addEventListener('load', function() {
    //Socket.configureSocket();
    
    socket.on('time', function(data) {
        //console.log(data);
    });

    socket.on('data', function(data) {
        //console.log(data);
        for (var key in data) {
            gameInfo[key] = data[key];
        }
    });

    socket.on('queueInfo', function(data) {
        console.log(data);
        gameInfo.queueLength = data.queueLength;
    });
});

function resizeCanvas() {
    const style = getComputedStyle(canvas);
    const top = parseInt(style.marginTop);
    const left = parseInt(style.marginLeft);
    const right = parseInt(style.marginRight);
    const bottom = parseInt(style.marginBottom);
    const border = parseInt(style.border);

    // Ustawienie rozmiaru canvas
    canvas.width = window.innerWidth - left - right - 2 * border;
    canvas.height = window.innerHeight - top - bottom - 2 * border;
    
    
    currentState.resize(canvas.width, canvas.height);
}
// Ustawienie rozmiaru canvas na początku
resizeCanvas();
//states.game.loadTargets('../data/targets.json', canvas.width, canvas.height);
window.requestAnimationFrame(draw);
window.addEventListener('resize', resizeCanvas);

//status check and send to server
setInterval(() => {
    if (MenuOptionsToChoose['Quick start'] === 1) {
        console.log('joining queue');
        socket.emit('joinQueue');
        MenuOptionsToChoose['Quick start'] = 0;
    }
    else if (MenuOptionsToChoose['leaveQueue'] === 1) {
        console.log('leaving queue');
        socket.emit('leaveQueue');
        MenuOptionsToChoose['leaveQueue'] = 0;
    }

}, 50);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'CadetBlue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    currentState.draw(ctx, gameInfo);
    drawCrosshair(mouseCoords.x, mouseCoords.y, ctx);
    window.requestAnimationFrame(draw);
}

function drawCrosshair(x, y, ctx) {
    var length = 15;
    var bigRadius = 12;
    var smallRadius = 6;
    ctx.lineCap = 'round';
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(x - length, y);
    ctx.lineTo(x + length, y);
    ctx.moveTo(x, y - length);
    ctx.lineTo(x, y + length);
    ctx.moveTo(x, y);

    ctx.arc(x, y, bigRadius, 0, 2 * Math.PI);
    ctx.arc(x, y, smallRadius, 0, 2 * Math.PI);

    ctx.stroke();
}

canvas.addEventListener('mousemove', function(event) {
    // Pobieranie współrzędnych kursora względem canvas
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;  // X współrzędna względem lewego górnego rogu canvas
    var y = event.clientY - rect.top;   // Y współrzędna względem lewego górnego rogu canvas

    mouseCoords.x = x;
    mouseCoords.y = y;

    currentState.update('move', mouseCoords.x, mouseCoords.y);
});

canvas.addEventListener('mousedown', function(event) {
    currentState.update('mouseDown', mouseCoords.x, mouseCoords.y);
});

canvas.addEventListener('mouseup', function(event) {
    var info = currentState.update('mouseUp', mouseCoords.x, mouseCoords.y);
    if (info === 'Quick start') {
        MenuOptionsToChoose['Quick start'] = 1;
    }
    else if (info === 'Waiting...') {
        MenuOptionsToChoose['leaveQueue'] = 1;
    }
});