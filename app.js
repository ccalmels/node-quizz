const express = require('express');
const body_parser = require("body-parser")

const app = express();

app.set('view engine', 'pug');
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

app.get('/', function(req, res) {
    res.render('index');
});

app.listen(3000, function() {
    console.log('Listening on localhost:3000');
});
