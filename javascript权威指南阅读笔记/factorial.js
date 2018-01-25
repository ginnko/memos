// 实现具有记忆功能的阶乘函数
// 出自犀牛书p200



// 通用函数
function memorize(f){
  var result = {};
  return function(){
    var key = arguments.length + Array.prototype.join.call(arguments, ",");
    if(key in result){
      return result[key];
    }else{
      return result[key] = f.apply(this, arguments);
    }
  };
}
// 阶乘函数
var factorial = memorize(function(n){
  return (n <= 1) ? 1 : n * factorial(n - 1); 
});

//使用
console.log(factorial(5));
