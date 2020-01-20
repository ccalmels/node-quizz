const express = require('express');
const websocket = require('express-ws');
const body_parser = require("body-parser")

const app = express();
const wss = websocket(app);

function get_random_number() {
    return Math.floor(Math.random() * 40 + 10);
}

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
	console.log('got msg: ' + msg + ' want: ' + ws.myresponse);
	if (ws.myresponse == msg)
	    console.log('ok');
	else
	    console.log('nok');
    });

    const first = get_random_number();
    const second = get_random_number();

    ws.myresponse = first + second;
    ws.send(JSON.stringify({
	type: 'question',
	data: first + ' + ' + second + ' = '
    }));

    ws.myprogress = 0;
    setInterval(function() {
	ws.myprogress += 1;
	if (ws.myprogress > 100)
	    ws.myprogress = 0;

	ws.send(JSON.stringify({
	    type: 'progress',
	    data: ws.myprogress + '%'
	}))}, 50);
});

app.listen(3000, function() {
    console.log('Listening on localhost:3000');
});
