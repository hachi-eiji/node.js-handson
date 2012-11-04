var http = require('http'),
    util = require('util');

var server = http.createServer(function(req, res){
  setTimeout(function(){
    res.writeHead(503, {'Content-Type': 'text/plain'});
    res.write("I'm busy\n");
    res.end();
  }, 1000);
});

server.listen(3000);
