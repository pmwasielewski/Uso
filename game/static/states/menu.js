import Button from '../data/button.js';
import Icon from '../data/icon.js';

export default class Menu {
    constructor(width, height) {
        this.start = new Button('Quick start', width/2 - 100, height/2 - 125, 200, 150, 'black', 'white', 'grey', width, height);
        this.gameModes = new Button('game modes', width/2 - 75, height/2 + 50, 150, 100, 'black', 'white', 'grey', width, height);
        this.instructions = new Button('How to play', width/2 - 50, height/2 + 175, 100, 50, 'black', 'white', 'grey', width, height);
        this.ranking = new Icon(20, 20, 50, 50, 'black', 'yellow', 'grey', width, height, 'ranking');
        this.profile = new Icon(width - 70, 20, 50, 50, 'black', 'Aquamarine', 'grey', width, height, 'profile');
        //this.chat = new swipeWindow(100, 850, 200, 100, 'black', 'yellow', 'grey');
        //this.friends = new swipeWindow(100, 1000, 200, 100, 'black', 'yellow', 'grey');
        this.elements = [this.start, this.gameModes, this.instructions, this.ranking, this.profile];
    }

    resize(width, height) {
        this.elements.forEach(element => element.resize(width, height));
    }

    draw(ctx) {
        this.elements.forEach(element => element.draw(ctx));
    }

    update(action, x, y) {
        switch (action) {
            case 'move':
                this.elements.forEach(element => element.update('move', x, y));
                break;
            
            case 'mouseDown':
                
                break;

            case 'mouseUp':
                break;
        }
    }

}