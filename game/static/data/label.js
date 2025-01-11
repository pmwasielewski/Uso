
export default class Label {
    //windowWidth: 800, windowHeight: 600
    constructor(text, x, y, width, height, textColor, canvasWidth, canvasHeight) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.labelWidth = width;
        this.labelHeight = height;
        this.textColor = textColor;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.fontSize = 20;
    }

    resize(width, height) {
        this.x *= width / this.canvasWidth;
        this.y *= height / this.canvasHeight;
        this.labelWidth *= width / this.canvasWidth;
        this.labelHeight *= height / this.canvasHeight;
        this.canvasWidth = width;
        this.canvasHeight = height;

        // var ctx = document.getElementById('canvas').getContext('2d');
        // ctx.font = `${this.fontSize}px "Courier New"`;
        // while (ctx.measureText(this.text).width < this.labelWidth && this.fontSize * 1.4 < this.labelHeight) {
        //     this.fontSize++; // Zwiększaj rozmiar czcionki
        //     ctx.font = `${this.fontSize}px "Courier New"`;
        // }
        // this.fontSize--;
        this.resizeFont(this.text);
    }

    resizeFont() {
        var maxFontW = Math.floor(this.labelWidth / (this.text.length * 0.65) );
        var maxFontH = Math.floor(this.labelHeight);
        this.fontSize = Math.min(maxFontW, maxFontH);
    }


    draw(ctx) {
        var text = this.text;
        ctx.fillStyle = this.textColor;
        ctx.font = `${this.fontSize}px "Courier New"`;
        var textWidth = ctx.measureText(text).width;
        ctx.fillText(text, this.x + (this.labelWidth - textWidth) / 2, this.y + this.labelHeight - this.fontSize / 2);
    }

    setText(text) {
        this.text = text;
        this.resizeFont();
    }

    setTimeText(time) {
        var min = Math.floor(time / 60000);
        time -= min * 60000;
        var sec = Math.floor(time / 1000);
        time -= sec * 1000;
        var milisec = time % 100;
        var time = '';

        if (milisec == 0) {
            milisec = '00';
        }
        else if (milisec < 10) {
            milisec = '0' + milisec;
        }
        if (min == 0) {
            time = sec + '.' + milisec;
        }
        else {
            if (sec < 10) {
                sec = '0' + sec;
            }
            time = min + ':' + sec + '.' + milisec;
        }
        this.text = time;
        this.resizeFont();
    }

    update(action, x, y) {
        switch (action) {
        }
    }
}