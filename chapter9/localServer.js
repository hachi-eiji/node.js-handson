var net = require('net');

var server = net.createServer();
server.listen(11111, '127.0.0.1', function(){
  console.log('listen start');
});

server.on('connection', function(socket){
  socket.setEncoding('utf8');
  var data = '';
  var ret = socket.write('これが -> ' + data);
  console.log('ret ->', ret);
  socket.on('data', function(chunk){
    data += chunk;
  });
  socket.on('end', function(){
    console.log('call data event');
    //console.log('data ->', data);
  });
  socket.on('drain', function(){
    console.log('call drain');
    console.log('buffer size -> ', socket.bufferSize);
  });
});

