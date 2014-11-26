var net = require('net');

var server = net.createServer();
server.maxConnections = 3;

function Data (d){
  this.data = d;
  this.responsed = false;
}

function Client(socket){
  this.counter = 0;
  this.socket = socket;
  this.t_queue = {}; // 未実行のタイマーオブジェクト.keyはsetTimeoutの戻り値
  this.w_queue = []; // 未送信データの配列
}

Client.prototype.writeData = function (d, id){
  var socket = this.socket
    , t_queue = this.t_queue
    , w_queue = this.w_queue;

  // 未送信データが先頭にいない時は処理を止める
  if (w_queue[0] && w_queue[0].data !== d){
    return ;
  }

  // タイムアウトを過ぎているデータを送信
  while(w_queue[0] && w_queue[0].responsed){
    var w_data = w_queue.shift().data;
    if(!socket.writable){
      continue;
    }
    var key = socket.remoteAddress + ':' + socket.remotePort;
    process.stdout.write('[' + key + '] - ' + w_data);
    socket.write('[R] '+ w_data, function(){
      delete t_queue[id];
    });
  }
}

var clients = {};

server.on('connection', function(socket){
  var status = server.connections + '/' + server.maxConnections;
  var key = socket.remoteAddress + ':' + socket.remotePort;
  console.log('Connection Start (' + status + ') - ' + key);
  clients[key] = new Client(socket);
});


server.on('connection', function(socket){
  var data = '';
  socket.on('data', function(chunk){
    function writeDataDelayed(key, d){
      var client = clients[key];
      var d_obj = new Data(d);
      client.w_queue.push(d_obj);
      var tmout = setTimeout(function(){
        d_obj.responsed = true;
        client.writeData(d_obj.data, client.counter);
      }, Math.random() * 10 * 1000);
      client.t_queue[client.counter++] = tmout;
    }

    data += chunk.toString();
    var key = socket.remoteAddress + ':' + socket.remotePort;
    if(/\n|\r\n/.test(data)){
      writeDataDelayed(key, data);
      data = '';
    }
  });
});

server.on('connection', function(socket){
  var key = socket.remoteAddress + ':' + socket.remotePort;
  socket.on('end', function(){
    var status = server.connections + '/' + server.maxConnections;
    console.log('Connection End (' + status + ') - ' + key);
    delete clients[key];
  });
});

server.on('end', function(){
  console.log('Server Closed');
});

server.listen(11111, '127.0.0.1', function(){
  var addr = server.address();
  console.log('Listening Start on Server '+ addr.address + ':' + addr.port);
});

process.on('SIGINT', function(){
  for(var i in clients){
    clients[i].socket.end();
    var t_queue = clients[i].t_queue;
    for(var j in t_queue){
      clearTimeout(t_queue[j]);
    }
  }

  server.close();
});
