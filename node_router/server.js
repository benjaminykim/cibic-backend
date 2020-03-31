const express = require('express');
const url = 'http://52.9.99.38:3000/';
const app = express();

app.get('/', (req, res) => res.send('Welcome to Cibic.io'));

app.get('/api/:path', function (req, res) {
	let redir = url + req.params.path
	console.log(redir);
 	res.location(redir).status(301).end();
}).listen(80);
