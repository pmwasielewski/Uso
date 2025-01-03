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

        this.currentBezierPointIndex = 0;
        this.bezierPointsNumber = 1000;
        this.bezierPoints = [];
        this.prefixSumOfDistances = [0];
        this.sufixSumOfDistances = new Array(this.bezierPointsNumber).fill(0);
        for (let i = 0; i < this.bezierPointsNumber; i++) {
            this.bezierPoints.push(this.getBezierPoint(i / this.bezierPointsNumber));

            if (i > 0) {
                this.prefixSumOfDistances.push(this.prefixSumOfDistances[i - 1] + Target.distanceOfTwoPoints(this.bezierPoints[i][0], this.bezierPoints[i][1], this.bezierPoints[i - 1][0], this.bezierPoints[i - 1][1]));
            }

        }

        for (let i = this.bezierPointsNumber - 2; i >= 0; i--) {
            this.sufixSumOfDistances[i] = this.sufixSumOfDistances[i + 1] + Target.distanceOfTwoPoints(this.bezierPoints[i][0], this.bezierPoints[i][1], this.bezierPoints[i + 1][0], this.bezierPoints[i + 1][1]);
        }
    }

    awardPoints() {
        var points = Math.ceil(5 * (this.currentBezierPointIndex / this.bezierPointsNumber));
        if (this.currentBezierPointIndex == this.bezierPointsNumber - 1) {
            points *= 2;
        }
        else if (this.currentBezierPointIndex == 0) {
            points = 1;
        }

        return points;
    }

    closestBezierPoint(x, y) {
        var minDistance = Target.distanceOfTwoPoints(x, y, this.x, this.y);
        var pointX = this.x;
        var pointY = this.y;
        var mouseDistance = Target.distanceOfTwoPoints(x, y, this.x, this.y);
        var bestIndex = this.currentBezierPointIndex;

        for (let i = this.currentBezierPointIndex; i >= 0; i--) {
            var estimatedDistance = this.sufixSumOfDistances[i] - this.sufixSumOfDistances[this.currentBezierPointIndex];
            if (estimatedDistance > mouseDistance)  {
                break;
            }
            
            var distance = Target.distanceOfTwoPoints(x, y, this.bezierPoints[i][0], this.bezierPoints[i][1]);
            if (distance < minDistance) {
                minDistance = distance;
                pointX = this.bezierPoints[i][0];
                pointY = this.bezierPoints[i][1];
                bestIndex = i;
            }
        }

        for (let i = this.currentBezierPointIndex; i < this.bezierPointsNumber; i++) {
            var estimatedDistance = this.prefixSumOfDistances[i] - this.prefixSumOfDistances[this.currentBezierPointIndex];
            if (estimatedDistance > mouseDistance) {
                break;
            }

            var distance = Target.distanceOfTwoPoints(x, y, this.bezierPoints[i][0], this.bezierPoints[i][1]);
            if (distance < minDistance) {
                minDistance = distance;
                pointX = this.bezierPoints[i][0];
                pointY = this.bezierPoints[i][1];
                bestIndex = i;
            }
        }

        this.currentBezierPointIndex = bestIndex;
        this.x = pointX;
        this.y = pointY;
    }

    dragged(x, y) {
        if (!this.dragging) {
            this.dragging = true;
            return;
        }

        if (this.distance(x, y) > this.radius) {
            this.dragging = false;
            return;
        }

        this.closestBezierPoint(x, y);
    }

    getBezierPoint(t) {
        // B(t) = (1 - t)^2 * P0 + 2 * (1 - t) * t * P1 + t^2 * P2
        // from definition becouse we have 3 points so its fast and numerically stable
        var x = (1 - t)**2 * this.bezierControlPoints[0][0] + 2 * (1 - t) * t * this.bezierControlPoints[1][0] + t**2 * this.bezierControlPoints[2][0];
        var y = (1 - t)**2 * this.bezierControlPoints[0][1] + 2 * (1 - t) * t * this.bezierControlPoints[1][1] + t**2 * this.bezierControlPoints[2][1];

        return [x, y];
    }

    update(action, x, y) {
        switch (action) {
            case 'move':
                if (this.dragging) {
                    this.dragged(x, y);

                    if (!this.dragging) {
                        this.alive = false;
                        return this.awardPoints();
                    }
                    return 0;
                }
                return null;
            case 'mouseDown':
                if (super.hit(x, y)) {
                    this.dragged(x, y);
                    this.dragging = true;
                    return 0;
                }
                return null;

            case 'mouseUp':
                if (this.dragging) {
                    this.alive = false;
                    return this.awardPoints();
                }
                return null;
            default:
                return null;
            }
    }

    draw (ctx) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = this.radius;
        ctx.beginPath();
        ctx.moveTo(this.bezierControlPoints[0][0], this.bezierControlPoints[0][1]);
        ctx.quadraticCurveTo(this.bezierControlPoints[1][0], this.bezierControlPoints[1][1], this.bezierControlPoints[2][0], this.bezierControlPoints[2][1]);
        ctx.stroke();

        for (let i = 0; i < this.bezierPointsNumber; i++) {
            ctx.fillStyle = 'blue';
            ctx.beginPath();
            ctx.arc(this.bezierPoints[i][0], this.bezierPoints[i][1], 2, 0, 2 * Math.PI);
            ctx.fill();
        }

        super.draw(ctx);
    }

    static fromJSON(obj) {
        var dragTarget = new DragTarget([], obj.radius, obj.width, obj.height);
        dragTarget.x = obj.x;
        dragTarget.y = obj.y;
        dragTarget.alive = obj.alive;
        dragTarget.dragging = obj.dragging;
        dragTarget.bezierControlPoints = obj.bezierControlPoints;
        dragTarget.currentBezierPointIndex = obj.currentBezierPointIndex;
        dragTarget.bezierPointsNumber = obj.bezierPointsNumber;
        dragTarget.bezierPoints = obj.bezierPoints;
        dragTarget.prefixSumOfDistances = obj.prefixSumOfDistances;
        dragTarget.sufixSumOfDistances = obj.sufixSumOfDistances;

        return dragTarget;
    }
}
        