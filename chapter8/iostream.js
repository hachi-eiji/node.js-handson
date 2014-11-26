var path = require('path'),
    fs   = require('fs');

// output
var outputPath = path.join(__dirname, 'write.txt');
var writeStream = fs.createWriteStream(outputPath);

// input
var inputPath = path.join(__dirname, 'test.txt');
var readStream = fs.createReadStream(inputPath);

writeStream.on('error', function(err){
  console.log('An error occurred');
  console.log(err);
});

writeStream.on('close', function(){
  console.log('writable stream closed');
});

writeStream.on('drain', function(){
  console.log('resumed writing');
  readStream.resume();
});


readStream.on('data', function(data){
  console.log('>> a data event occurred.');
  if(writeStream.write(data) == false){
    console.log('paused writing');
    readStream.pause();
  }
});

readStream.on('end', function(){
  console.log('read end');
});

readStream.on('error', function(err){
  console.log('An error occurred');
  console.log(err);
});
