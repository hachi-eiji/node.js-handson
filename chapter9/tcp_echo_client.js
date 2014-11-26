var net = require('net');
var readline = require('readline');

var option = {
  host: process.argv[2] || 'localhost',
  port: process.argv[3] || '11111'
};
var client = net.connect(option
, function(){
  console.log('client connected');
});


// error
client.on('error', function(err){
  console.error('Connection Failed - ' + option.host + ':' + option.port);
  console.error(err.message);
});

var i = 0;
client.setTimeout(1000);
client.on('timeout', function(){
  var str = i + ':Hello World\n';
  process.stdout.write('[S] ' + str);
  client.write(str);
  i += 1;
});

client.on('data', function(chunk){
  process.stdout.write(chunk.toString());
});

//var rl = readline.createInterface(process.stdin, process.stdout);
process.on('SIGINT', function(){
  client.end();
  //rl.close();
});


client.on('end', function(had_error){
  client.setTimeout(0);
  console.log('Connection End - ' + option.host + ':' + option.port);
});

client.on('close', function(){
  console.log('Client Close');
});
