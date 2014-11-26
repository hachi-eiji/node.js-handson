var events = require('events');
var util = require('util');

function AsyncEmitter(){
  var self = this;
  process.nextTick(function(){
    self.emit('bar');
  });
}

util.inherits(AsyncEmitter, events.EventEmitter);
var foo = new AsyncEmitter();

foo.on('bar', function(){
  console.log('bar event emitted');
});
