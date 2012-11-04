var http = require('http'),
    util = require('util'),
    fs   = require('fs');


var server = http.createServer(function(req, res){
  var read = fs.createReadStream('helloworld.html');
  var head = true;
  
  util.log(req.url);

  // ファイル読み込み失敗
  read.on('error', function(){
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.write('IO ERROR \n');
    res.end();
  });

  // ファイルを読み込み時に実行
  read.on('data', function(data){
    util.log('called data');

    if(head){
      res.writeHead(200, {'Content-Type': 'text/plain'});
      head = false;
    }
    res.write(data);
  });

  // ファイル読み込み完了時
  read.on('end', function(){
    util.log('called end');
    res.end();
  });
});
server.listen(3000);
