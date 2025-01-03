// import { Target } from './target.js';
// import { ClickTarget } from './clickTarget.js';
// import { DragTarget } from './dragTarget.js';

//var http = require('http');
//var express = require('express');
import express from 'express';
import http from 'http';
import fs from 'fs';

//var jsonTargets = fs.readFileSync('targets.json');
//var targets = JSON.parse(jsonTargets);


var app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('static'));


app.get('/', function(req, res) {
    
    res.render('index');
});


http.createServer(app).listen(3000);