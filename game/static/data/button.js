
export default class Button {
    //windowWidth: 800, windowHeight: 600
    constructor(text, x, y, width, height, backgroundColor, textColor, higlightColor, canvasWidth, canvasHeight) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.buttonWidth = width;
        this.buttonHeight = height;
        this.backgroundColor = backgroundColor;
        this.textColor = textColor;
        this.highlightColor = higlightColor;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.fontSize = 10;
        this.currentTextColor = this.textColor;
    }

    resize(width, height) {
        this.x *= width / this.canvasWidth;
        this.y *= height / this.canvasHeight;
        this.buttonWidth *= width / this.canvasWidth;
        this.buttonHeight *= height / this.canvasHeight;
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.fontSize = 10;

        var ctx = document.getElementById('canvas').getContext('2d');
        ctx.font = `${this.fontSize}px Arial`;
        while (ctx.measureText(this.text).width < 2*this.buttonWidth/3 && this.fontSize * 1.2 < this.buttonHeight) {
            console.log(this.text + this.fontSize);
            this.fontSize++; // Zwiększaj rozmiar czcionki
            ctx.font = `${this.fontSize}px Arial`;
        }
        this.fontSize--;
    }

    draw(ctx) {
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(this.x, this.y, this.buttonWidth, this.buttonHeight);
        ctx.fillStyle = this.currentTextColor;
        ctx.font = `${this.fontSize}px Arial`;
        var textWidth = ctx.measureText(this.text).width;
        ctx.fillText(this.text, this.x + this.buttonWidth / 2 - textWidth / 2, this.y + this.buttonHeight / 2 + 10);
    }

    update(action, x, y) {
        switch (action) {
            case 'move':
                if (x > this.x && x < this.x + this.buttonWidth && y > this.y && y < this.y + this.buttonHeight) {
                    this.currentTextColor = this.highlightColor;
                } else {
                    this.currentTextColor = this.textColor;
                }
                break;
            
            case 'mouseDown':
                if (x > this.x && x < this.x + this.buttonWidth && y > this.y && y < this.y + this.buttonHeight) {
                    return this.text;
                }
                break;

            case 'mouseUp':
                break;
        }
    }
}