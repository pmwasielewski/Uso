
export default class Label {
    //windowWidth: 800, windowHeight: 600
    constructor(text, x, y, width, height, textColor, canvasWidth, canvasHeight, edgeColor) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.labelWidth = width;
        this.labelHeight = height;
        this.textColor = textColor;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.fontSize = 20;
        this.edgeColor = edgeColor;
    }

    resize(width, height, labels) {
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
        this.resizeFont(labels);
    }

    setSize(x, y, width, height, labels) {
        this.x = x;
        this.y = y;
        this.labelWidth = width;
        this.labelHeight = height;
        console.log(this.labelWidth, this.labelHeight);

        this.resizeFont(labels);
    }

    resizeFont(labels) {
        var maxFontW = Math.floor(this.labelWidth / (this.text.length * 0.65) );
        var maxFontH = Math.floor(this.labelHeight);
        this.fontSize = Math.min(maxFontW, maxFontH);

        if (labels) {
            var minFont = this.fontSize;

            for (let i = 0; i < labels.length; i++) {
                if (labels[i].fontSize < minFont) {
                    minFont = labels[i].fontSize;
                }
            }

            for (let i = 0; i < labels.length; i++) {
                labels[i].fontSize = minFont;
            }
        }
    }


    draw(ctx) {
        var text = this.text;
        ctx.fillStyle = this.textColor;
        ctx.font = `${this.fontSize}px "Courier New"`;
        var textWidth = ctx.measureText(text).width;
        ctx.fillText(text, this.x + (this.labelWidth - textWidth) / 2, this.y + this.labelHeight - (this.labelHeight - this.fontSize) / 2 - 3);
        if (this.edgeColor) {
            ctx.strokeStyle = this.edgeColor;
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.labelWidth, this.labelHeight);
        }
    }

    setText(text, labels) {
        this.text = text.toString();
        this.resizeFont(labels);
    }

    setColor(color) {
        this.textColor = color;
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