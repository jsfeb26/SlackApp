var Promise = require('bluebird');
var socket_io = Promise.promisifyAll(require('socket.io'));
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var userCount = 0;

io.on('connection', function (socket) {
	userCount += 1;
	console.log('Users connected: ' + userCount);
	io.emit('userCount', userCount);
	socket.broadcast.emit('connected');

    socket.on('message', function(message) {
    	socket.broadcast.emit('message', {userName: message.userName, body: message.body});
    });

    socket.on('disconnect', function() {
    	userCount -= 1;
    	console.log('Users connected: ' + userCount);
		io.emit('userCount', userCount);
		socket.broadcast.emit('disconnected');
    });
});

server.listen(process.env.PORT || 8080); // need to have this to work on heroku