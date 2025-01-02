
export class Target {
    constructor(targets, radius, width, height) {
        this.width = width;
        this.height = height;
        this.targets = targets;
        this.radius = radius;
        this.circleNumber = 10;
        this.colors = ['white', 'black', 'blue', 'orange', 'yellow']

    }

    static distanceOfTwoPoints(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2);
    }
}