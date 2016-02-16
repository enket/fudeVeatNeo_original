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
var sockets = [];

io.on('connection', function(socket) {
  xy.forEach(function(data) {
    socket.emit('draw', data);
  });

  sockets.push(socket);

  socket.on('disconnect', function() {
    sockets.splice(sockets.indexOf(socket), 1);
  });

  socket.on('clear', function() {
    xy.length = 0;
    broadcast('clear', 1);
  });

  socket.on('draw', function(data) {
    var data_cal = {
      last: { x : 0.0, y : 0.0 },
      dist: 0.0,
      angle: 0.0,
      velo: { a: 0.0, b: 0.0 }
    };
    var dist;
    var angle;
    var velo = {a: 0.0, b: 0.0};

    console.log(data.last.x);
    data_cal.last.x = data.last.x;
    data_cal.last.y = data.last.y;
    
    dist = distanceBetween(data.last, data.current);
    angle = angleBetween(data.last, data.current);
    velo.a = data.last.rad;
    velo.b = (data.current.rad - data.last.rad) / data.current.rad;

    data_cal.dist = dist;
    data_cal.angle = angle;
    data_cal.velo = velo;

    broadcast('draw', data_cal);
    xy.push(data_cal);

  });
});


function broadcast(event, data) {
  sockets.forEach(function(socket) {
    socket.emit(event, data);
  });
}

function distanceBetween(point1, point2) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

function angleBetween(point1, point2) {
  return Math.atan2(point2.x - point1.x, point2.y - point1.y);
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});