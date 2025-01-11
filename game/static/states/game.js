import Target from '../data/target.js';
import ClickTarget from '../data/clickTarget.js';
import DragTarget from '../data/dragTarget.js';
import Label from '../data/label.js';

export default class Game {
    constructor(gameInfo, width, height) {
        this.sumOfPoints = 0;
        this.targets = [];
        this.lives = {count: 3, x: canvas.width - 50, y: 50, step: 50};
        this.gameInfo = gameInfo;
        this.timeLabel = new Label('time', width - 100, height - 50, 90, 30, 'black', width, height);
        this.maxPoints = 0;
        this.gameEnded = false;

        //server time of game start
        this.serverStartTime = this.gameInfo.serverTime - this.gameInfo.ping / 2;
        this.clientStartTime = Date.now();
        this.timeElapsed = 0;
        

        // this.interval = setInterval(() => {
        //     this.timeElapsed = Date.now() - this.clientTime;

        // }, 50);
    }

    //path = '../data/targets.json'
    async loadTargets(width, height) {
        var path = this.gameInfo.path;
        this.targets = await fetch(path)
            .then(response => response.json())
            .catch(error => console.error(error));


        this.targets.forEach((target, index) => { 
            if (target.hasOwnProperty('bezierControlPoints')) {
                this.targets[index] = DragTarget.fromJSON(target);
            } else {
                this.targets[index] = ClickTarget.fromJSON(target);
            }
            this.maxPoints += this.targets[index].maxPoints;
        });

        this.resize(width, height);
    }

    resize(width, height) {
        // Zmiana rozmiaru targetów
        this.targets.forEach(target => { target.resize(width, height); });

        //zmiana pozycji serc
        this.lives.x = width - 50;

        this.timeLabel.resize(width, height);
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

    draw(ctx, gameInfo) {
        if (this.gameEnded) return;

        this.timeElapsed = Date.now() - this.clientStartTime;

        //for (let i = 0; i < this.targets.length; i++) this.targets[i].draw(ctx);
        this.targets[0].draw(ctx);

        this.drawScore(this.sumOfPoints, ctx);
        this.drawLives(this.lives, ctx);
        this.timeLabel.setTimeText(this.timeElapsed);
        this.timeLabel.draw(ctx);
    }

    gameOver() {
        var points = ((this.sumOfPoints/this.maxPoints) * 100) / Math.pow((this.timeElapsed)/60000, 0.5);
        this.gameEnded = true;
        return {info: 'endGame', points: points};
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
        if (this.gameEnded == false && (this.targets.length == 0 || this.lives.count == 0)) {
            console.log('game over');
            
            return this.gameOver();
        }

        return null;
    }

}