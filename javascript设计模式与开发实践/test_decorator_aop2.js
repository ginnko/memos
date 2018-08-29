Function.prototype.before = function(beforefn) {
  var _self = this;
  return function() {
    beforefn.apply(this, arguments); //.......................(1)
    return _self.apply(this, arguments);//..................(2)
  };
};

var func = function(param) {
  console.log(param);
};

func = func.before(function(param) {
  param.b = 'b';
});
func({a: 'a'});