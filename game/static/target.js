
export class Target {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.circleNumber = 10;
        this.colors = ['white', 'black', 'blue', 'orange', 'yellow']
    }

    draw(ctx) {
        var color_index = -1;
        for (let i = 0; i < this.circleNumber; i++) {
            if (i % 2 == 0) color_index++;
            var radius_i = this.radius - i * this.radius / this.circleNumber;

            var gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius_i);
            gradient.addColorStop(1, this.colors[color_index]);
            gradient.addColorStop(0, 'black');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, radius_i, 0, 2 * Math.PI);
            //ctx.fillStyle = this.colors[color_index];
            ctx.fill();
            ctx.closePath();
            x_i + radius_i;
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