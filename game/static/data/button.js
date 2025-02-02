
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
        this.time = 0;
        setInterval(() => {
            if (this.text === 'Waiting...' && (this.time == 0 || (this.time+1) % 10 == 0)) {
                this.time += 1;
                this.resizeFont(this.text);
                this.time -= 1;
            }
            this.time += 1;
        }, 1000);
        this.resizeFont(this.text);
    }

    resize(width, height) {
        this.x *= width / this.canvasWidth;
        this.y *= height / this.canvasHeight;
        this.buttonWidth *= width / this.canvasWidth;
        this.buttonHeight *= height / this.canvasHeight;
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.fontSize = 10;

        this.resizeFont(this.text);
    }

    resizeFont(text) {
        if (text === 'Waiting...') {
            text = text + ' ' + this.time + "s. " + "Players in queue: _";
        }


        // var ctx = document.getElementById('canvas').getContext('2d');
        // ctx.font = `${this.fontSize}px "Courier New"`;
        // while (ctx.measureText(text).width < this.buttonWidth-5 && this.fontSize * 1.6 < this.buttonHeight) {
        //     this.fontSize++; // Zwiększaj rozmiar czcionki
        //     ctx.font = `${this.fontSize}px "Courier New"`;
        // }
        // this.fontSize--;

        var maxFontW = Math.floor(this.buttonWidth / (text.length * 0.65) );
        var maxFontH = Math.floor(this.buttonHeight);
        this.fontSize = Math.min(maxFontW, maxFontH);
    }

    draw(ctx, gameInfo) {
        var text = this.text;
        if (this.text === 'Waiting...') {
            if (gameInfo.queueLength !== undefined) {
                text = text + ' ' + this.time + "s. Players in queue: " + gameInfo.queueLength;
            } else
            text = text + ' ' + this.time + "s. Players in queue: 1";
        }

        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(this.x, this.y, this.buttonWidth, this.buttonHeight);
        ctx.fillStyle = this.currentTextColor;
        ctx.font = `${this.fontSize}px "Courier New"`;
        var textWidth = ctx.measureText(text).width;
        ctx.fillText(text, this.x + this.buttonWidth / 2 - textWidth / 2, this.y + this.buttonHeight/2 + this.fontSize/2);
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
                break;

            case 'mouseUp':
                if (x > this.x && x < this.x + this.buttonWidth && y > this.y && y < this.y + this.buttonHeight) {
                    return this.text;
                }
                break;
        }
    }
}