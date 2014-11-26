var count = 0;
module.exports = {
  say: function(name){
    count++;
    console.log('Hello ' + name);
  },
  getCount: function(){
    return count;

  },
  resetCount: function(){
    count = 0;
  }
};
