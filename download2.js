var util = require('util'),
  url  = require('url'),
  http = require('http');


function download(urlStr){
  var u = url.parse(urlStr),
    requestOptions = {
      host: u.hostname,
      port: u.port || 80,
      path: u.path,
      method: 'GET'
    };

  var request = http.request(requestOptions, function(res){
    var buff = '';

    res.setEncoding('utf8');
    res.on('data', function(chunk){
      buff += chunk
    });

    // respose終了時 イベント
    // 終了時でないとレスポンスが「届いた」順にバラバラ表示される
    // レスポンスが「終了」した順番に処理を捌くのであればここで実装する
    res.on('end', function(){
      for(var i in res.headers){
        console.log('%s : %s', i, res.headers[i]);
      }
      console.log('');
      util.print(buff);
      console.log('');
    });
  });

  request.on('error', function(e){
    console.log('error message is %s', e.message);
  });
  request.end();
}

var argv = process.argv;
for(var i=2, len=argv.length; i < len; i++){
  download(argv[i]);
}
