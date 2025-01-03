import { Target } from './target.js';

export class ClickTarget extends Target {
    constructor(targets, radius, width, height) {
        super(radius, width, height);

        this.randomizePosition(targets);
    }

    randomizePosition(targets) {
        var x = Math.random() * (this.width - 2 * this.radius) + this.radius;
        var y = Math.random() * (this.height - 2 * this.radius) + this.radius;

        for (let i = 0; i < targets.length; i++) {
            if (targets[i].distance(x, y) < this.radius + targets[i].radius) {
                return this.randomizePosition(targets);
            }
        }
        this.x = x;
        this.y = y;
    }

    distance(x , y) {
        return Math.sqrt((this.x - x)**2 + (this.y - y)**2);
    }

    hit(x, y) {
        if (this.distance(x, y) > this.radius) 
            return 0;
        else {
            var areas = this.circleNumber / 2;
            var areaThickness = this.radius / areas;
            var distance = this.distance(x, y);
            var hitArea = Math.ceil(distance / areaThickness);
            var points = areas - hitArea + 1;

            console.log(points);
            return points;
        }
    }

    update(action, x, y) {
        switch (action) {
            case 'mouseDown':
                if (this.hit(x, y)) {
                    var points = this.hit(x, y);
                    this.alive = false;
                    return points;
                }
                return null;
            default:
                return null;
        }
    }


    draw(ctx) {
        var color_index = -1;
        var circleThickness = this.radius / this.circleNumber;
        var radius_i = this.radius;
        for (let i = 0; i < this.circleNumber; i++) {
            if (i % 2 == 0){
                color_index++;
                var gradient = ctx.createRadialGradient(this.x, this.y, radius_i - 2*circleThickness, this.x, this.y, radius_i);
                gradient.addColorStop(1, this.colors[color_index]);
                if (color_index + 1 < this.colors.length) {
                    gradient.addColorStop(0, this.colors[color_index + 1]);
                }
                else
                    gradient.addColorStop(0, 'black');
            }

            
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, radius_i, 0, 2 * Math.PI);
            //ctx.fillStyle = this.colors[color_index];
            ctx.fill();
            ctx.closePath();
            radius_i -= circleThickness;

            
        }
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        //ctx.moveTo(this.x, this.y);
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.moveTo(this.x - this.radius, this.y);
        ctx.stroke();
        ctx.closePath();
    }

    static fromJSON(obj) {
        var target = new ClickTarget([], obj.radius, obj.width, obj.height);
        target.x = obj.x;
        target.y = obj.y;
        target.alive = obj.alive;
        return target;
    }
}