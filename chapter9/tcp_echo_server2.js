var net = require('net');

var server = net.createServer();
server.maxConnections=3;

function Client(socket){
  this.socket = socket;
  this.counter = 0;
  this.t_queue = {};
}

Client.prototype.writeData = function(d, id){
  var socket = this.socket;
  var t_queue = this.t_queue;
  if(socket.writable){
    var key = socket.remoteAddress + ':' + socket.remotePort;
    process.stdout.write('[' + key + '] - ' + d);
    socket.write('[R] ' + d, function(){
      delete t_queue[id];
    });
  }
};

var clients = {};
server.on('connection', function(socket){
  var key = socket.remoteAddress + ':' + socket.remotePort;

  server.getConnections(function(err, count){
    var status = count + '/' + server.maxConnections;
    console.log('Connection Start (' + status + ') - ' + key);
  });
  clients[key] = new Client(socket);
  
  var data = '';
  socket.on('data', function(chunk){
    data += chunk.toString();

    function writeDataDelayed(key, d){
      var client = clients[key];
      var timeout = setTimeout(function(){
        client.writeData(d, client.counter);
        data = '';
      }, Math.random() * 10 * 1000);
      client.t_queue[client.counter++] = timeout;
    }

    if(/\n|\r\n/.test(data)){
      writeDataDelayed(key, data);
      data = '';
    }
  });

  socket.on('end', function(){
    server.getConnections(function(err, count){
      var status = count + '/' + server.maxConnections;
      console.log('Connection End (' + status + ') - ' + key);
    });
    delete clients[key];
  });
});


server.listen(11111, '127.0.0.1', function(){
  console.log('Start Listening server...');
});

server.on('close', function(){
  console.log('Close server');
});

process.on('SIGINT', function(){
  for(var i in clients){
    clients[i].socket.end();

    var t_queue = clients[i].t_queue;
    for(var id in t_queue){
      clearTimeout(t_queue[id]);
    }
  }
  server.close();
});

