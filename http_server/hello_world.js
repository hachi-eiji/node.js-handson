var http = require('http'),
    util = require('util');

var server = http.createServer(function(req, res){
  res.writeHeader(200, {'Content-Type': 'text/plain'});
  res.write('Hello World\n');
  res.end();
});

server.on('request', function(req, res){
  util.log(req.url + '"' + req.headers['user-agent'] + '"');
});
server.listen(3000);
