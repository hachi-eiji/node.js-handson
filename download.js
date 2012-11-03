var util = require('util'),
	url  = require('url'),
	http = require('http');

function download(urlStr){
	var u = url.parse(urlStr);
	
	var hoge = http.get(u, function(response){
		console.log(response.statusCode);
		for(var i in response.headers){
			console.log("%s : %s", i, response.headers[i]);
		}
		console.log('');
		response.setEncoding('utf8');
		response.on('data', function(chunk){
			util.print(chunk);
		});
		response.on('end', function(){
			console.log('');
		});
	}).on('error', function(e){
		console.log('problem with request '+ e.message);
	});
}

download(process.argv[2]);
