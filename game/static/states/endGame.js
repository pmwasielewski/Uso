import Statistics from '../data/statistics.js';
import Button from '../data/button.js';

export default class endGame {
    constructor(gameInfo, width, height, currentWidth, currentHeight, yourNick) {
        //800 x 600
        this.width = width;
        this.height = height;
        this.playersCount = gameInfo.game.players.length;
        this.statHeight = 50;
        this.info = gameInfo;
        this.yourNick = yourNick;
        
        this.statWidth = width - 2 * 50;
        this.boxX = 50;
        this.boxY = this.statHeight;

        this.stats = [];
        this.statDetails = new Statistics(this.boxX, 0, this.statWidth, this.statHeight, 'Place', 'Nick', 'Score', 'Time', 'Points', width, height, "black", "black");
        this.stats.push(this.statDetails);

        var x = this.boxX;
        var y = 0;
        for (let i = 0; i < this.playersCount; i++) {
            y += this.statHeight;
            var nick = gameInfo.game.players[i];

            var score = gameInfo.game.scores.findIndex(score => score.id === nick).points || '';
            var place = gameInfo.game.scores.findIndex(score => score.id === nick) + 1 || '';
            var points = "";
            var color = "black";
            var time = "";
            this.stats.push(new Statistics(x, y, this.statWidth, this.statHeight, place, nick, score, time, points, width, height, color, color));
            //console.log(this.stats[i])

        }

        this.resize(currentWidth, currentHeight);
        //this.stats.forEach(stat => stat.resize(currentWidth, currentHeight));

        this.refresh(gameInfo);
        this.i = setInterval(() => {
            this.refresh(gameInfo);
        }, 1000);
    }

    resize(width, height) {
        this.boxX *= width / this.width;
        this.statWidth *= width / this.width;
        this.width = width;
        this.height = height;
        this.statHeight = height/(this.playersCount + 3);
        this.boxHeight = (height/this.statHeight) * this.playersCount; //1 from top, 2 from bottom
        this.boxY = this.statHeight;

        var y = this.boxY;
        for (let i = 0; i < this.stats.length; i++) {
            this.stats[i].setSize(this.boxX, y, this.statWidth, this.statHeight);
            y += this.statHeight;
        }


        
    }

    draw(ctx, gameInfo) {
        this.stats.forEach(stat => stat.draw(ctx));
    }

    update(action, x, y) {
        switch (action) {
            case 'move':
                break;
            
            case 'mouseDown':
                break;

            case 'mouseUp':
                break;
        }

        return null;
    }

    updatePlaces() {
        var y = this.boxY;
        for (let i = 0; i < this.stats.length; i++) {
            this.stats[i].y = y;
            y += this.statHeight;

            this.stats[i].updateY();
        }

    }

    sortScores() {
        this.stats.sort((a, b) => {
            return b.score - a.score;
        });

        this.updatePlaces();
    }

    refresh(gameInfo) {
        
        for (let i = 1; i < this.stats.length; i++) {
            var nick = this.stats[i].nick;
            var color = "black";
            if (nick === this.yourNick) {
                color = "red";
            }
            var score = gameInfo.game.scores.find(score => score.id === nick);
            score = score ? score.points : '';
            var place = gameInfo.game.scores.findIndex(score => score.id === nick) + 1 || '';
            var points = "";
            var time = "";
            this.stats[i].update(place, nick, score, time, points, color);
        }
        this.sortScores();
    }



}