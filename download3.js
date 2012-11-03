var util = require('util'),
	url  = require('url'),
	http = require('http');

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

var argv = process.argv;
var len = argv.length;
for(var i = 2; i < len; i++){
	download(argv[i], i-2);
}

// 全部の処理を待つための関数定義
var downloads = new Array(argv.length-2),
	max = len-2,
	done = 0;

function notifyDone(index, res, body){
	downloads[index] = {
		response: res,
		body: body
	};
	done = done + 1;
	if(done == max){
		allDone();
	}
}

// 全部の処理が終了したら実行
function allDone(){
	for(var i in downloads){
		var r = downloads[i];
		console.log("----[%s]", i);
		console.log(r.response.statusCode);
		for(var j in r.response.headers){
			console.log("%s : %s", j, r.response.headers[j]);
		}
		console.log('');
		util.print(r.body);
		console.log('');
	}
}
