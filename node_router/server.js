const url = 'https://api.cibic.io:3000/';
const https = require("https");
const fs = require("fs");

const express = require('express');
const app = express();
const router = express.Router()

const options = {
    key: fs.readFileSync('/srv/api.cibic.io.key'),
    cert: fs.readFileSync('/srv/api.cibic.io.crt'),
};

router.all('/api/*', function (req, res) {
    let redir = url + req.params[0]
    console.log(redir);
    res.redirect(redir);
    res.end();
})

app.use(router);
app.listen(3443);

https.createServer(options, app).listen(443);
