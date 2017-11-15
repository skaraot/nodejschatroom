const express = require('express');
const bodyParser = require("body-parser");
const session = require('express-session');
const validator = require('express-validator');
const server = express();

var path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'pug'); //server.set('view engine', 'pug'); // template engine set pug
server.use(express.static(path.join(__dirname, 'public')));
server.use(express.static(path.join(__dirname, 'bower_components')));

server.use(session({secret: 'sdjkSDFsldsa@k2ikdsP92'}));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

var sess;

require('./route/route.js')(server);

server.listen(port, function(){
   console.log('chatroom listen on port --> ' + port);
});