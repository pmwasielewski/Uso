<<<<<<< HEAD
=======
import {Target} from './target.js';

>>>>>>> 7ef9fdf (class Target)
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
var mouseCoords = {x: 0, y: 0};

<<<<<<< HEAD
=======


>>>>>>> 7ef9fdf (class Target)
window.requestAnimationFrame(draw);
    
function resizeCanvas() {
    canvas.width = window.innerWidth - 100;
    canvas.height = window.innerHeight - 100;
}

// Ustawienie rozmiaru canvas na początku
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

var target1 = new Target(100, 100, 50);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    target1.draw(ctx);
    
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
<<<<<<< HEAD

    ctx.moveTo(x - bigRadius, y);
    ctx.arc(x, y, bigRadius, 0, 2 * Math.PI);
    ctx.moveTo(x - smallRadius, y);
=======
    ctx.moveTo(x, y);

    ctx.arc(x, y, bigRadius, 0, 2 * Math.PI);
>>>>>>> 7ef9fdf (class Target)
    ctx.arc(x, y, smallRadius, 0, 2 * Math.PI);

    ctx.stroke();



    
}
window.addEventListener('load', draw);

canvas.addEventListener('mousemove', function(event) {
    // Pobieranie współrzędnych kursora względem canvas
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;  // X współrzędna względem lewego górnego rogu canvas
    var y = event.clientY - rect.top;   // Y współrzędna względem lewego górnego rogu canvas

    mouseCoords.x = x;
    mouseCoords.y = y;

    //drawCrosshair(x, y, ctx);

    
});