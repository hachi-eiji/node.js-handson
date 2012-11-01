var util = require('util'),
	url  = require('url'),
	http = require('http');

function download(urlStr){
	var u = url.parse(urlStr),
		options = {
			host: u.hostname,
			port: u.port || 80,
			path: u.path,
			method: 'GET'
		};

	var request = http.request(options, function(response){
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
	});
	
	// error handler
	request.on('error', function(e){
		console.log('problem with request '+ e.message);
	});
	request.end();
}

download(process.argv[2]);
