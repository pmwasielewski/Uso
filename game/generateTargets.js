import { ClickTarget } from "./static/clickTarget.js";
import { DragTarget } from "./static/dragTarget.js";
import fs from 'fs';


var targets = [];

for (let i = 0; i < 2; i++) {
    targets.push(new DragTarget(targets, 40, 800, 600));
}

for (let i = 0; i < 5; i++) {
    targets.push(new ClickTarget(targets, 40, 800, 600));
}

var jsonTargets = JSON.stringify(targets, null, 4);
fs.writeFileSync('./static/targets.json', jsonTargets);
console.log('Targets generated and saved to targets.json');