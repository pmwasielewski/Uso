import Label from "./label.js";
export default class Statistics {
    constructor (x, y, width, height, place, nick, score, time, points, canvasWidth, canvasHeight, textColor, edgeColor) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.place = place;
        this.nick = nick;
        this.score = score || -1;
        this.time = time;
        this.points = points;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.textColor = textColor;
        this.edgeColor = edgeColor;

        this.placeLabel = new Label(place, x, y, width/6, height, textColor, canvasWidth, canvasHeight, edgeColor);
        this.nickLabel = new Label(nick, x + width/6, y, 3 * width/6, height, textColor, canvasWidth, canvasHeight, edgeColor);
        this.scoreLabel = new Label(score, x + 4 * width/6, y, 2 * width/6, height, textColor, canvasWidth, canvasHeight, edgeColor);
    
        this.labels = [this.placeLabel, this.nickLabel, this.scoreLabel];
    }

    resize(width, height) {
        this.x *= width / this.canvasWidth;
        this.y *= height / this.canvasHeight;
        this.width *= width / this.canvasWidth;
        this.height *= height / this.canvasHeight;
        this.canvasWidth = width;
        this.canvasHeight = height;

        this.placeLabel.resize(width, height);
        this.nickLabel.resize(width, height);
        this.scoreLabel.resize(width, height, this.labels);
    }

    setSize(x, y, statWidth, statHeight) {
        this.x = x;
        this.y = y;
        this.width = statWidth;
        this.height = statHeight;

        this.placeLabel.setSize(x, y, statWidth/6, statHeight);
        this.nickLabel.setSize(x + statWidth/6, y, 3 * statWidth/6, statHeight);
        this.scoreLabel.setSize(x + 4 * statWidth/6, y, 2 * statWidth/6, statHeight, this.labels);
    }

    draw(ctx) {
        this.placeLabel.draw(ctx);
        this.nickLabel.draw(ctx);
        this.scoreLabel.draw(ctx);
    }

    update(place, nick, score, time, points, color) {
        this.score = score;
        score = Math.round(score);
        this.place = place;
        this.placeLabel.setText(place, this.labels);
        this.nickLabel.setText(nick, this.labels);
        this.scoreLabel.setText(score, this.labels);
        this.placeLabel.setColor(color);
        this.nickLabel.setColor(color);
        this.scoreLabel.setColor(color);
    }

    updateY() {
        this.placeLabel.y = this.y;
        this.nickLabel.y = this.y;
        this.scoreLabel.y = this.y;
    }

    

}