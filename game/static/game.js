import { Target } from './target.js';
import { ClickTarget } from './clickTarget.js';
import { DragTarget } from './dragTarget.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
var mouseCoords = {x: 0, y: 0};
var sumOfPoints = 0;
var dragging = false;


window.requestAnimationFrame(draw);
    
function resizeCanvas() {
    canvas.width = window.innerWidth - 100;
    canvas.height = window.innerHeight - 100;
}

// Ustawienie rozmiaru canvas na początku
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

//var target1 = new Target(100, 100, 50);
var targets = [];
for (let i = 0; i < 3; i++) {
    var target = new DragTarget(targets, 100, canvas.width, canvas.height);
    targets.push(target);
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < targets.length; i++) targets[i].draw(ctx);
    
    drawScore(sumOfPoints, ctx);
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

function drawScore(points, ctx) {
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + points, 10, 30);
}


window.addEventListener('load', draw);

canvas.addEventListener('mousemove', function(event) {
    // Pobieranie współrzędnych kursora względem canvas
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;  // X współrzędna względem lewego górnego rogu canvas
    var y = event.clientY - rect.top;   // Y współrzędna względem lewego górnego rogu canvas

    mouseCoords.x = x;
    mouseCoords.y = y;

    for (let i = 0; i < targets.length; i++) {
        var points = targets[i].update('move', mouseCoords.x, mouseCoords.y);
        if (points != null) {
            sumOfPoints += points;
            break;
        }
    }
    targets = targets.filter(target => target.alive == true);

    
});

canvas.addEventListener('click', function(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;  // X współrzędna względem lewego górnego rogu canvas
    var y = event.clientY - rect.top;   // Y współrzędna względem lewego górnego rogu canvas
});

canvas.addEventListener('mousedown', function(event) {
    for (let i = 0; i < targets.length; i++) {
        var points = targets[i].update('mouseDown', mouseCoords.x, mouseCoords.y);
        if (points != null) {
            sumOfPoints += points;
            break;
        }
        if (i == targets.length - 1) {
            console.log('miss');
        }
    }
    targets = targets.filter(target => target.alive == true);
});

canvas.addEventListener('mouseup', function(event) {
    for (let i = 0; i < targets.length; i++) {
        var points = targets[i].update('mouseUp', mouseCoords.x, mouseCoords.y);
        if (points != null) {
            sumOfPoints += points;
            break;
        }
    }
    targets = targets.filter(target => target.alive == true);
});