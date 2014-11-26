var net = require('net');
var readline = require('readline');

var server = net.createServer();
server.maxConnections = 3;

function Client(socket){
  this.socket = socket;
}

Client.prototype.writeData = function(d){
  var socket = this.socket;
  if(socket.writable){
    var key = getKey(socket);
    process.stdout.write('[' + key + '] - ' + d);
    socket.write('[R] ' + d);
  }
};

var clients = {};

server.on('connection', function(socket){
  var key = getKey(socket);
  server.getConnections(function(err, count){
      var status = count +  '/' + server.maxConnections;
      console.log('Connection Start(' + status + ') - ' + key);
      clients[key] = new Client(socket);
  });
});

server.on('connection', function(socket){
  socket.setEncoding('utf-8');
  var key = getKey(socket);
  var data = '';
  socket.on('data', function(chunk){
    data += chunk;

    if(/\n|\r\n/.test(data)){
      clients[key].writeData(data);
      data = '';
    }

  });

  socket.on('end', function(){
    server.getConnections(function(err, count){
        var status = count +  '/' + server.maxConnections;
        console.log('Connection End(' + status + ') - ' + key);
        delete clients[key];
    });
  });
});

server.on('close', function(){
  console.log('Server closed');
});

server.listen(11111, '127.0.0.1', function(){
  var address = server.address();
  console.log('Listening Start on Server - ' + address.address + ':' + address.port);
});

var rl = readline.createInterface(process.stdin, process.stdout);
rl.on('SIGINT', function(){
  for(var i in clients){
    var socket = clients[i].socket;
    socket.close();
  }
  server.close();
  rl.close();
});

function getKey(socket){
  if(socket){
    return socket.remoteAddress + ':' + socket.remotePort;
  }
}
