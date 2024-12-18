var http = require('http');
var express = require('express');


var app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('static'));


app.get('/', function(req, res) {
    console.log('odebrano zapytanie');
    res.render('index');
});


http.createServer(app).listen(3000);