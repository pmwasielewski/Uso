import ClickTarget from "./static/data/clickTarget.js";
import DragTarget from "./static/data/dragTarget.js";
import fs from 'fs';

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

export default function generateTargets(dragTargetsCount, clickTargetCount, pathFile) {
    var targets = [];

    for (let i = 0; i < dragTargetsCount; i++) {
        targets.push(new DragTarget(targets, 40, 800, 600));
    }

    for (let i = 0; i < clickTargetCount; i++) {
        targets.push(new ClickTarget(targets, 40, 800, 600));
    }

    targets = shuffle(targets);
    

    var jsonTargets = JSON.stringify(targets, null, 4);
    //'./static/targets.json'
    fs.writeFileSync(pathFile, jsonTargets);
    console.log('Targets generated and saved to targets.json');
    return targets;
}