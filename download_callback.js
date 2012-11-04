var util = require('util'),
    url  = require('url'),
    http = require('http');

/**
 * レスポンス格納する
 */
var sites = function(checkSiteNum){
  var that = {
    downloads: [],
    max: checkSiteNum,
    done: 0
  };

  // レスポンスを格納
  var add = function(index, response, body){
    that.downloads[index] = {
      body: body,
      response: response
    };
    that.done = that.done + 1;
  };

  // すべて格納したか判断
  var isFinish = function(){
    return that.done === that.max;
  };

  // 結果を表示
  var showAll = function(){
    var downloadArray = that.downloads;

    for(var i in downloadArray){
      var download = downloadArray[i],
          res = download.response;

      console.log(res.statusCode);
      for(var key in res.headers){
        console.log('%s : %s', key, res.headers[key]);
      }
      console.log('');
      util.print(download.body);
      console.log('');
    }
  };

  that.add = add;
  that.isFinish = isFinish;
  that.showAll = showAll;
  return that;
};

function download(urlStr, index, callback){
  var u = url.parse(urlStr);
  var options = {
    host: u.host,
    port: u.port || 80,
    path: u.path
  };
  http.get(options, function(res){
    var buf = '';
    res.setEncoding('utf8');
    
    // レスポンスを受け付けた時
    res.on('data', function(chunk){
      buf += chunk;
    });

    res.on('end', function(){
      callback && callback(index, res, buf);
    });
  }).on('error', function(e){
    console.log('get error %s', e.message);
  });
}

function notifyDone(index, res, buf){
  downloadSite.add(index, res, buf);
  if(downloadSite.isFinish()){
    downloadSite.showAll();
  }
}

// main
var argv = process.argv;
var len = argv.length;
var downloadSite = sites(len-2);

for(var i = 2; i < len ; i++){
  download(argv[i], i-2, notifyDone); 
}
