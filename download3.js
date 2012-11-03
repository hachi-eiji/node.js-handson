var util = require('util'),
  url  = require('url'),
  http = require('http');

/**
 * レスポンスを格納する関数
 */
var sites = function(checkSiteNum){
  var that = {
    downloads: [],     // 結果を格納するオブジェクト
    max: checkSiteNum,  // リクエストを投げる予定の数
    done: 0        // リクエストを投げた数
  };

  // レスポンスを格納
  var add = function(index, response, body){
    this.downloads[index] = {
      response: response,
      body: body
    };
    this.done = that.done + 1;
  };
  // 全てのリクエストを処理したか
  var isFinish = function(){
    return this.done === this.max;
  };
  // 全ての結果を表示
  var printAll = function(){
    for(var i in this.downloads){
      var r = this.downloads[i];
      var res = r.response;
      console.log(res.statusCode);
      for(var j in res.headers){
        console.log("%s : %s", j, res.headers[j]);
      }
      console.log('');
      util.print(r.body);
      console.log('');
    }
  };

  that.add = add;
  that.isFinish = isFinish;
  that.printAll = printAll;
  return that;
}

function download(urlStr, index){
  var u = url.parse(urlStr),
    requestOptions = {
      host: u.hostname,
      port: u.port || 80,
      path: u.path,
      method: 'GET'
    };
  
  var req = http.request(requestOptions, function(res){
    var buff = '';
    res.setEncoding('utf8');
    res.on('data', function(chunk){
      buff += chunk;
    });

    res.on('end', function(){
      notifyDone(index, res, buff);
    });
  });
  req.end();
}

function notifyDone(index, res, body){
  downloadSite.add(index, res, body);
  if(downloadSite.isFinish()){
    downloadSite.printAll();
  }
}


// ここからメイン
var argv = process.argv;
var len = argv.length;
for(var i = 2; i < len; i++){
  download(argv[i], i-2);
}

// 全部の処理を待つための関数定義
var downloadSite = sites(len-2);
