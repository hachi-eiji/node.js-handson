/**
 * math module
 */

exports.add = function(){
  var sum=0, i=0, args=arguments, l=args.length;
  while(i < l){
    sum += args[i++];
  }
  return sum;
};

// this function is not exported
function sum(){
  var s=0, i=0, args=arguments, l=args.length;
  while(i < l){
    s += args[i++];
  }
  return s;
}
console.log('math module loaded');
