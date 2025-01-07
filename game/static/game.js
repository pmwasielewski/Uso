import { Target } from './target.js';
import { ClickTarget } from './clickTarget.js';
import { DragTarget } from './dragTarget.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
var mouseCoords = {x: 0, y: 0};
var sumOfPoints = 0;
var targets = [];
var target1 = new ClickTarget(targets, 100, canvas.width, canvas.height);
console.log(target1);

targets = await fetch('targets.json')
    .then(response => response.json())
    .catch(error => console.error(error));
console.log(targets);

targets.forEach((target, index) => { 
    if (target.hasOwnProperty('bezierControlPoints')) {
        targets[index] = DragTarget.fromJSON(target);
    } else {
        targets[index] = ClickTarget.fromJSON(target);
    }
    if (targets[index] instanceof Target) console.log('Target is an instance of Target');
 });
console.log(targets);

window.requestAnimationFrame(draw);
    
function resizeCanvas() {
    const style = getComputedStyle(canvas);
    const top = parseInt(style.marginTop);
    const left = parseInt(style.marginLeft);
    const right = parseInt(style.marginRight);
    const bottom = parseInt(style.marginBottom);
    const border = parseInt(style.border);

    console.log(window.innerWidth, window.innerHeight);
    canvas.width = window.innerWidth - left - right - 2 * border;
    canvas.height = window.innerHeight - top - bottom - 2 * border;
    console.log(canvas.width, canvas.height);
    targets.forEach(target => { target.resize(canvas.width, canvas.height); });
}

// Ustawienie rozmiaru canvas na początku
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
        
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