var http          = require('http'),
    fs            = require('fs'),
    querystring   = require('querystring'),
    util          = require('util'),
    ejs           = require('ejs');

function extractParams(url){
  return querystring.parse(url.split('?')[1] || '');
}

var server = http.createServer(function(req, res){
  var template = fs.readFileSync(__dirname + '/template.ejs');
  var params = extractParams(req.url);
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write(ejs.render(template.toString(), {
    locals: {
              name: util.inspect(params)
            }
  }));

  res.end();
});
server.listen(3000);
