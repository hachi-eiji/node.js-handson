var io   = require('socket.io'),
    TwBot = require('twbot').TwBot,
    http = require('http'),
    fs = require('fs'),
    util = require('util'),
    io = require('socket.io');

var TW_OPTION = {

};

var bot = new TwBot(TW_OPTION);
bot.startUserStream();

var server = http.createServer(function(req, res){
  res.writeHeader({'Content-Type': 'text/html'});
  var read = fs.createReadStream(__dirname + '/broadcast.html');
  read.on('error', function(err){
    res.end(err.stack);
  });

  read.on('data', function(data){
    res.write(data);
  });

  read.on('end', function(){
    res.end();
  });
});
server.listen(3000);

var socket = io.listen(server);
var count = 0;
bot.on('status', function(tweet){
  socket.broadcast(JSON.stringify(tweet));
});
socket.on('connection', function(client){
  count = count + 1;
  socket.broadcast(count);
  client.on('disconnect', function(){
    count = count - 1;
    socket.broadcast(count);
  });
});
