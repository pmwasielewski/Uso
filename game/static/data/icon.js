export default class Button {
    //windowWidth: 800, windowHeight: 600
    constructor(x, y, width, height, backgroundColor, iconColor, higlightColor, canvasWidth, canvasHeight, info) {
        this.x = x;
        this.y = y;
        this.iconWidth = width;
        this.iconHeight = height;
        this.backgroundColor = backgroundColor;
        this.highlightColor = higlightColor;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.iconColor = iconColor;
        this.currentIconColor = iconColor;
        this.symbol = info;
    }

    resize(width, height) {
        this.x *= width / this.canvasWidth;
        this.y *= height / this.canvasHeight;
        this.iconWidth *= width / this.canvasWidth;
        this.iconHeight *= height / this.canvasHeight;
        this.canvasWidth = width;
        this.canvasHeight = height;
       
    }

    draw(ctx) {
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(this.x, this.y, this.iconWidth, this.iconHeight);
        
        if(this.symbol === 'profile') {
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.fillStyle = this.currentIconColor;
            var x1 = this.x + this.iconWidth/4;
            var x2 = this.x + this.iconWidth/3;
            var x3 = this.x + this.iconWidth/2;
            var y1 = this.y + this.iconHeight;
            var y2 = this.y + this.iconHeight/3;
            var y3 = this.y + this.iconHeight/3;
            ctx.moveTo(x1, y1);
            ctx.quadraticCurveTo(x2, y2, x3, y3);
            x1 = this.x + this.iconWidth - (x1 - this.x);
            x2 = this.x + this.iconWidth - (x2 - this.x);
            //x3 = this.x + this.iconWidth - (x3 - this.x);
            //ctx.moveTo(x1, y1);
            ctx.quadraticCurveTo(x2, y2, x1, y1);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            //ctx.moveTo(this.x + this.iconWidth/2, this.y + this.iconHeight/3);
            ctx.beginPath();
            ctx.arc(this.x + this.iconWidth/2, this.y + this.iconHeight/3, this.iconWidth/6, 0, 2*Math.PI);
            ctx.fill();
            ctx.stroke();
            
        }
        else if(this.symbol === 'ranking') {

        }
    }

    update(action, x, y) {
        switch (action) {
            case 'move':
                if (x > this.x && x < this.x + this.iconWidth && y > this.y && y < this.y + this.iconHeight) {
                    this.currentIconColor = this.highlightColor;
                } else {
                    this.currentIconColor = this.iconColor;
                }
                break;
            
            case 'mouseDown':
                break;

            case 'mouseUp':
                if (x > this.x && x < this.x + this.iconWidth && y > this.y && y < this.y + this.iconHeight) {
                    return this.symbol;
                }
                break;
        }
    }
}