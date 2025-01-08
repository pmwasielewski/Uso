import Target from '../data/target.js';
import ClickTarget from '../data/clickTarget.js';
import DragTarget from '../data/dragTarget.js';

export default class Game {
    constructor() {
        this.sumOfPoints = 0;
        this.targets = [];
        this.lives = {count: 3, x: canvas.width - 50, y: 50, step: 50};

    }

    //path = '../data/targets.json'
    async loadTargets(path, width, height) {
        this.targets = await fetch(path)
            .then(response => response.json())
            .catch(error => console.error(error));


        this.targets.forEach((target, index) => { 
            if (target.hasOwnProperty('bezierControlPoints')) {
                this.targets[index] = DragTarget.fromJSON(target);
            } else {
                this.targets[index] = ClickTarget.fromJSON(target);
            }
        });

        this.resize(width, height);
    }

    resize(width, height) {
        // Zmiana rozmiaru targetów
        this.targets.forEach(target => { target.resize(width, height); });

        //zmiana pozycji serc
        this.lives.x = width - 50;
    }

    drawScore(points, ctx) {
        ctx.font = '30px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('Score: ' + points, 10, 30);
    }
    
    drawLives(lives, ctx) {
        for (let i = 0; i < lives.count; i++) {
            this.drawHeart(lives.x - i * lives.step, lives.y, ctx);
        }
    
    }
    
    drawHeart(x, y, ctx) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 20, y - 25);
        ctx.arc(x - 10, y - 25, 10, Math.PI, 2*Math.PI);
        ctx.arc(x + 10, y - 25, 10, Math.PI, 2*Math.PI);
        ctx.moveTo(x + 20, y - 25);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.fillStyle = 'red';
        ctx.fill();
    }

    draw(ctx) {
        for (let i = 0; i < this.targets.length; i++) this.targets[i].draw(ctx);
    
        this.drawScore(this.sumOfPoints, ctx);
        this.drawLives(this.lives, ctx);
    }

    update(action, x, y) {
        switch (action) {
            case 'move':
                for (let i = 0; i < this.targets.length; i++) {
                    var points = this.targets[i].update('move', x, y);
                    if (points != null) {
                        this.sumOfPoints += points;
                        break;
                    }
                }
                this.targets = this.targets.filter(target => target.alive == true);
                break;
            
            case 'mouseDown':
                for (let i = 0; i < this.targets.length; i++) {
                    var points = this.targets[i].update('mouseDown', x, y);
                    if (points != null) {
                        this.sumOfPoints += points;
                        break;
                    }
                    if (i == this.targets.length - 1) {
                        console.log('miss');
                        this.lives.count--;
                    }
                }
                this.targets = this.targets.filter(target => target.alive == true);
                break;

            case 'mouseUp':
                for (let i = 0; i < this.targets.length; i++) {
                    var points = this.targets[i].update('mouseUp', x, y);
                    if (points != null) {
                        this.sumOfPoints += points;
                        break;
                    }
                }
                this.targets = this.targets.filter(target => target.alive == true);
                break;
        }
    }

}