var getSingle = function(fn) {
  var ret;
  return function() {
    return ret || (ret = fn.apply(this, arguments));
  };
};

var getScript = getSingle(function() {
  return {};
});

var script1 = getScript();
var script2 = getScript();

console.log('script1:', script1);
console.log('script2:', script2);
console.log(script1 === script2);