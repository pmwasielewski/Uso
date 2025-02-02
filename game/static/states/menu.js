import Button from '../data/button.js';
import Icon from '../data/icon.js';
import Label from '../data/label.js';

export default class Menu {
    constructor(width, height) {
        this.start = new Button('Quick start', width/2 - 100, height/2 - 125, 200, 150, 'black', 'white', 'grey', width, height);
        this.gameModes = new Button('game modes', width/2 - 75, height/2 + 50, 150, 100, 'black', 'white', 'grey', width, height);
        this.instructions = new Button('How to play', width/2 - 50, height/2 + 175, 100, 50, 'black', 'white', 'grey', width, height);
        this.ranking = new Icon(20, 20, 50, 50, 'black', 'yellow', 'grey', width, height, 'ranking');
        this.profile = new Icon(width - 70, 20, 50, 50, 'black', 'Aquamarine', 'grey', width, height, 'profile');
        //this.chat = new swipeWindow(100, 850, 200, 100, 'black', 'yellow', 'grey');
        //this.friends = new swipeWindow(100, 1000, 200, 100, 'black', 'yellow', 'grey');
        this.serverStatus = new Label('', 5, height-55, 100, 50, 'black', width, height);
        this.elements = [this.start, this.gameModes, this.instructions, this.ranking, this.profile, this.serverStatus];
        this.queue = false;
    }

    resize(width, height) {
        this.elements.forEach(element => element.resize(width, height));
    }

    draw(ctx, gameInfo) {
        this.serverStatus.setText('Online players: ' + gameInfo.onlinePlayers + ', Ping: ' + gameInfo.ping + 'ms');
        this.elements.forEach(element => element.draw(ctx, gameInfo));
    }

    update(action, x, y) {
        switch (action) {
            case 'move':
                this.elements.forEach(element => element.update('move', x, y));
                break;
            
            case 'mouseDown':
                break;

            case 'mouseUp':
                for (let i = 0; i < this.elements.length; i++) {
                    var optionChosen = this.elements[i].update('mouseUp', x, y);
                    if (optionChosen === 'Waiting...') {
                        this.elements[i] = new Button('Quick start', this.start.x, this.start.y, this.start.buttonWidth, this.start.buttonHeight, 'black', 'white', 'grey', this.start.canvasWidth, this.start.canvasHeight);
                        return {info: 'leaveQueue'};
                        
                    }
                    else if (optionChosen === 'Quick start') {
                        this.elements[i] = new Button('Waiting...', this.start.x, this.start.y, this.start.buttonWidth, this.start.buttonHeight, 'black', 'red', 'darkred', this.start.canvasWidth, this.start.canvasHeight);
                        return {info: 'joinQueue'};
                    }
                }
                break;
        }
    }

}