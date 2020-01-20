const express = require('express');
const websocket = require('express-ws');
const body_parser = require("body-parser")

const app = express();
const wss = websocket(app);

app.set('view engine', 'pug');
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

app.get('/', function(req, res) {
    res.render('index');
});

app.ws('/', function(ws, req) {
    console.log('new websocket client');

    ws.on('close', function(client) {
	console.log('websocket client exits');
    });

    ws.on('message', function(msg) {
	console.log('got msg: ' + msg);
    });

    ws.send('2 + 3 = ');
});

app.listen(3000, function() {
    console.log('Listening on localhost:3000');
});
