import { ClickTarget } from "./clickTarget.js";
import { Target } from "./target.js";

export class DragTarget extends ClickTarget {
    constructor(targets, radius, width, height) {
        super(targets, radius, width, height);

        this.dragging = false;
        // This target is on beziers curve that is defined by 3 points
        this.bezierControlPoints = [];
        this.bezierControlPoints.push([this.x, this.y]); // Start point
        // Randomize the rest three points
        for (let i = 0; i < 2; i++) {
            this.bezierControlPoints.push([Math.random() * width, Math.random() * height]);
        }

        this.bezierPointsNumber = 1000;
        this.bezierPoints = [];
        this.prefixSumOfDistances = [0];
        for (let i = 0; i < this.bezierPointsNumber; i++) {
            this.bezierPoints.push(this.getBezierPoint(i / this.bezierPointsNumber));

            if (i > 0) {
                this.prefixSumOfDistances.push(this.prefixSumOfDistances[i - 1] + Target.distanceOfTwoPoints(this.bezierPoints[i][0], this.bezierPoints[i][1], this.bezierPoints[i - 1][0], this.bezierPoints[i - 1][1]));
            }

        }
    }

    hit(x, y) {
        if (super.hit(x, y)) {
            console.log(this.bezierPoints);
        }

        return super.hit(x, y);

        
    }

    closestBezierPoint(x, y) {
        var minDistance = Target.distanceOfTwoPoints(x, y, this.x, this.y);
        var pointX = this.x;
        var pointY = this.y;

        for (let i = 0; i < this.bezierPointsNumber; i++) {
            var distance = Target.distanceOfTwoPoints(x, y, this.bezierPoints[i][0], this.bezierPoints[i][1]);
            if (distance < minDistance) {
                console.log("YATYYYYY");
                minDistance = distance;
                pointX = this.bezierPoints[i][0];
                pointY = this.bezierPoints[i][1];
            }
        }

        return [pointX, pointY];
    }

    dragged(x, y, previousX, previousY) {
        if (!this.dragging) {
            this.dragging = true;
            return;
        }

        if (this.distance(x, y) > this.radius) {
            this.dragging = false;
            return;
        }

        var closestPoint = this.closestBezierPoint(x, y);
        this.x = closestPoint[0];
        this.y = closestPoint[1];
    }

    getBezierPoint(t) {
        // B(t) = (1 - t)^2 * P0 + 2 * (1 - t) * t * P1 + t^2 * P2
        // from definition becouse we have 3 points so its fast and numerically stable
        var x = (1 - t)**2 * this.bezierControlPoints[0][0] + 2 * (1 - t) * t * this.bezierControlPoints[1][0] + t**2 * this.bezierControlPoints[2][0];
        var y = (1 - t)**2 * this.bezierControlPoints[0][1] + 2 * (1 - t) * t * this.bezierControlPoints[1][1] + t**2 * this.bezierControlPoints[2][1];

        return [x, y];
    }

    draw (ctx) {
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(this.bezierControlPoints[0][0], this.bezierControlPoints[0][1]);
        ctx.quadraticCurveTo(this.bezierControlPoints[1][0], this.bezierControlPoints[1][1], this.bezierControlPoints[2][0], this.bezierControlPoints[2][1]);
        ctx.stroke();

        for (let i = 0; i < this.bezierPointsNumber; i++) {
            ctx.fillStyle = 'blue';
            ctx.beginPath();
            ctx.arc(this.bezierPoints[i][0], this.bezierPoints[i][1], 2, 0, 2 * Math.PI);
            ctx.fill();
            //ctx.closePath();
        }

        super.draw(ctx);
    }

    

}
        