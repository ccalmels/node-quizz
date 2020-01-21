const express = require('express');
const websocket = require('express-ws');
const body_parser = require("body-parser")

const app = express();
const wss = websocket(app);

function get_random_number() {
    return Math.floor(Math.random() * 40 + 10);
}

function Question() {
    this.first = get_random_number();
    this.second = get_random_number();
    this.response = this.first + this.second;
    this.answer = '';
};

Question.prototype.toString = function() {
    return this.first + ' + ' + this.second + ' = ';
};

Question.prototype.isOk = function() {
    return this.response == this.answer;
};

function Quizz(ws) {
    this.ws = ws;
    this.questions = [];
    this.progress = 0;
    this.interval = undefined;
};

Quizz.prototype.increaseProgress = function() {
    this.progress += 1;
    if (this.progress > 100)
	return this.answer('');

    this.ws.send(JSON.stringify({
	type: 'progress',
	data: this.progress + '%'
    }));
};

Quizz.prototype.add = function(question) {
    this.progress = 0;
    this.questions.push(question);

    this.ws.send(JSON.stringify({
	type: 'question',
	data: question.toString()
    }));

    this.interval = setInterval(() => this.increaseProgress(), 50);
};

Quizz.prototype.answer = function(answer) {
    clearInterval(this.interval);

    const q = this.questions[this.questions.length - 1];
    q.answer = answer;

    if (this.questions.length < 10)
	this.add(new Question());
    else {
	this.questions.forEach(function(q) {
	    if (q.isOk())
		console.log(q.toString() + q.answer + ' right');
	    else
		console.log(q.toString() + q.response + ' fails, you said: ' + q.answer);
	});
    }
};

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
	ws.quizz.answer(msg);
    });

    ws.quizz = new Quizz(ws);
    ws.quizz.add(new Question());
});

app.listen(3000, function() {
    console.log('Listening on localhost:3000');
});
