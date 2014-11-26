var path = require('path');
    fs   = require('fs');

var outputPath = path.join(__dirname, 'write.txt');
var writeStream = fs.createWriteStream (outputPath);

var inputPath = path.join(__dirname, 'test.txt');
var readableStream = fs.createReadStream(inputPath);

writeStream.on('pipe', function(){
  console.log('a readableStream pipes writeStream');
});
writeStream.on('error', function(err){
  console.log('A error occurred');
  console.log(err);
});
writeStream.on('close', function(){
  console.log('writable stream closed');
});

readableStream.pipe(writeStream);

readableStream.on('data', function(){
  console.log('>> a data event occurred');
});
readableStream.on('end', function(){
  console.log('read end');
});
readableStream.on('close', function(){
  console.log('read close');
});
readableStream.on('error', function(){
  console.log('A error occurred');
  console.log(err);
});
