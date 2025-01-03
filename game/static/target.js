
export class Target {
    constructor(radius, width, height) {
        this.width = width;
        this.height = height;
        this.radius = radius;
        this.circleNumber = 10;
        this.colors = ['white', 'black', 'blue', 'orange', 'yellow']
        this.alive = true;

    }

    static distanceOfTwoPoints(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2);
    }

    resize(width, height) {
        var dWidth = (width - this.width) / this.width;
        var dHeight = (height - this.height) / this.height;
        var biggerChange = Math.max(dWidth, dHeight);

        this.width = width;
        this.height = height;
        //this.radius *= 1 + biggerChange;

    }
}