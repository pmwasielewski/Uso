
export class Target {
    constructor(targets, radius, width, height) {
        this.width = width;
        this.height = height;
        this.targets = targets;
        this.radius = radius;
        this.circleNumber = 10;
        this.colors = ['white', 'black', 'blue', 'orange', 'yellow']

        this.randomizePosition();
    }

    randomizePosition() {
        var x = Math.random() * (this.width - 2 * this.radius) + this.radius;
        var y = Math.random() * (this.height - 2 * this.radius) + this.radius;

        for (let i = 0; i < this.targets.length; i++) {
            if (this.targets[i].distance(x, y) < this.radius + this.targets[i].radius) {
                return this.randomizePosition();
            }
        }
        this.x = x;
        this.y = y;
    }

    distance(x , y) {
        return Math.sqrt((this.x - x)**2 + (this.y - y)**2);
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
}