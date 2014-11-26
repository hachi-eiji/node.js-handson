var path = require('path'),
    fs   = require('fs');

var filePath = path.join(__dirname, 'test.txt');
var readStream = fs.createReadStream(filePath, {highWaterMark: 4});
readStream.setEncoding('utf8');

console.log(readStream.readable);

readStream.on('data', function(data){
  console.log('*** a data event occurred ***');
  console.log(data);
});
readStream.on('end', function(){
  console.log('end');
});
readStream.on('error', function(err){
  console.log('An error occurred');
  console.log(err);
});
