var util = require('util'),
	url  = require('url'),
	http = require('http');

function download(urlStr){
	var u = url.parse(urlStr),
		client = http.createClient(u.port || 80, u.hostname),
		request = client.request('GET', 
							u.pathname,
							{ host: u.hostname}
							);
	request.end();

	request.on('response', function(response){
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
}

download(process.argv[2]);
