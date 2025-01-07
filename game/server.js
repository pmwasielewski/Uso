import express from 'express';
import http from 'http';

var app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('static'));


app.get('/', function(req, res) {
    
    res.render('index');
});

app.get('/play', function(req, res) {
    res.render('play');
});


http.createServer(app).listen(3000);