var TwBot = require('twbot').TwBot,
    http  = require('http'),
    fs = require('fs'),
    util = require('util'),
    io = require('socket.io');

var TW_OPTION = {
  consumerKey:'',
  consumerSecret: '',
  accessKey: '',
  accessSecret:  ''
};

var bot = new TwBot(TW_OPTION);
bot.startUserStream();

var server = http.createServer(function(req, res){
  res.writeHeader(200, {'Content-Type': 'text/html'});
  var read = fs.createReadStream(__dirname + '/websocket.html');
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
console.log(socket);
socket.on('connection', function(client){
  util.log('call connection');

  var fun = function(tweet){
    //console.log('%s : %s', tweet.user.screen_name, tweet.text);
    util.log('call status');
    client.send(JSON.stringify(tweet));
  };
  bot.on('status', fun);

  client.on('message', function(message){
    util.log('receive message');
  });

  client.on('disconnect', function(){
    util.log('call disconnect');
    // クライアントが消えたらイベントを外す
    bot.removeListener('status', fun);
  });
});
