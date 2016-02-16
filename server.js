//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var socketio = require('socket.io');
var express = require('express');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));
var xy = [];

io.on('connection', function(socket) {
  xy.forEach(function(data) {
    socket.emit('draw', data);
  });

  socket.on('clear', function() {
    xy.length = 0;
    socket.broadcast.emit('clear', 1);
  });

  socket.on('draw', function(data) {
    socket.broadcast.emit('draw', data);
    xy.push(data);

  });
  
  socket.on('move', function(data) {
    socket.broadcast.emit('move', data);
    xy.push(data);

  });
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});