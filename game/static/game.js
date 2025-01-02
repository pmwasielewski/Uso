import { Target } from './target.js';
import { ClickTarget } from './clickTarget.js';
import { DragTarget } from './dragTarget.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
var mouseCoords = {x: 0, y: 0};
var previousMouseCoords = {x: 0, y: 0};
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
    var target = new DragTarget(targets, 50, canvas.width, canvas.height);
    targets.push(target);
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < targets.length; i++) targets[i].draw(ctx);
    
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
window.addEventListener('load', draw);

canvas.addEventListener('mousemove', function(event) {
    // Pobieranie współrzędnych kursora względem canvas
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;  // X współrzędna względem lewego górnego rogu canvas
    var y = event.clientY - rect.top;   // Y współrzędna względem lewego górnego rogu canvas

    previousMouseCoords.x = mouseCoords.x;
    previousMouseCoords.y = mouseCoords.y;
    mouseCoords.x = x;
    mouseCoords.y = y;

    if (dragging) {
        for (let i = 0; i < targets.length; i++) {
            if (targets[i].dragging) {
                console.log('LOOOL');
                targets[i].dragged(mouseCoords.x, mouseCoords.y, previousMouseCoords.x, previousMouseCoords.y);
                // ctx.strokeStyle = 'red';
                // ctx.beginPath();
                // ctx.moveTo(targets[i].x, targets[i].y);
                // ctx.lineTo(mouseCoords.x, mouseCoords.y);
                // ctx.stroke();
                break;
            }
        }
    }

    //drawCrosshair(x, y, ctx);
    
});

canvas.addEventListener('click', function(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;  // X współrzędna względem lewego górnego rogu canvas
    var y = event.clientY - rect.top;   // Y współrzędna względem lewego górnego rogu canvas

    for (let i = 0; i < targets.length; i++) {
        var points = targets[i].hit(x, y);
        if (points) {
            console.log('hit');
            sumOfPoints += points;
            targets.splice(i, 1);
            i--;
        }
    }
    console.log('click');
});

canvas.addEventListener('mousedown', function(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;  // X współrzędna względem lewego górnego rogu canvas
    var y = event.clientY - rect.top;   // Y współrzędna względem lewego górnego rogu canvas

    for (let i = 0; i < targets.length; i++) {
        if (targets[i].hit(x, y) && targets[i] instanceof DragTarget) {
            console.log('dragging');
            targets[i].dragged(x, y, previousMouseCoords.x, previousMouseCoords.y);
            dragging = true;
        }
    }
    console.log('mousedown');
});

canvas.addEventListener('mouseup', function(event) {
    for (let i = 0; i < targets.length; i++) {
        targets[i].dragging = false;
    }
    console.log('mouseup');
    dragging = false;
});