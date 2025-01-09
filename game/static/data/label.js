
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
        this.fontSize = 10;
    }

    resize(width, height) {
        this.x *= width / this.canvasWidth;
        this.y *= height / this.canvasHeight;
        this.labelWidth *= width / this.canvasWidth;
        this.labelHeight *= height / this.canvasHeight;
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.fontSize = 10;

        var ctx = document.getElementById('canvas').getContext('2d');
        ctx.font = `${this.fontSize}px Arial`;
        while (ctx.measureText(this.text).width < this.labelWidth && this.fontSize * 1.4 < this.labelHeight) {
            this.fontSize++; // Zwiększaj rozmiar czcionki
            ctx.font = `${this.fontSize}px Arial`;
        }
        this.fontSize--;
    }

    draw(ctx) {
        ctx.fillStyle = this.textColor;
        ctx.font = `${this.fontSize}px Arial`;
        var textWidth = ctx.measureText(this.text).width;
        ctx.fillText(this.text, this.x + this.labelWidth / 2 - textWidth / 2, this.y + this.labelHeight / 2 + 10);
    }

    setText(text) {
        this.text = text;
        this.resize(this.canvasWidth, this.canvasHeight);
    }

    update(action, x, y) {
        switch (action) {
        }
    }
}