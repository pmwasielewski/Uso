
export class Target {
    constructor(radius, width, height) {
        this.width = width;
        this.height = height;
        this.origScale  = {width: width, height: height, radius: radius};
        this.radius = radius;
        this.circleNumber = 10;
        this.colors = ['white', 'black', 'blue', 'orange', 'yellow']
        this.alive = true;

    }

    static distanceOfTwoPoints(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2);
    }

    resize(width, height) {
        this.x *= (width / this.width);
        this.y *= (height / this.height);
    
        //this.radius = this.origRadius * (width / this.width);
        var widthScale = width / this.origScale.width;
        var heightScale = height / this.origScale.height;
        this.radius = this.origScale.radius * Math.min(widthScale, heightScale);
        
        this.width = width;
        this.height = height;
    }
}