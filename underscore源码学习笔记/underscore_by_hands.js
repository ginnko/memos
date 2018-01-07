/*==========================================说明==================================================*/ 
// 标识：
// Q: 问题
// T：想法
// K: 知识点



/*===========================================正文===============================================*/ 
// Q-整个内容被定义在一个立即执行函数中，以.call()的形式调用，这个在其他代码中作为第三方库如何使用？
// T-可以直接用script标签引入，然后在其他js文件中直接使用？
(function(){
  var root = this;
  var preiousUnderscore = root._;

  // 一些简写
  var ArrayProto = Array.prototype, ObjProto = object.prototype, FuncProto = Function.prototype;
  var push = ArrayProto.push,
      silce = ArrayProto.slice,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;

  var Ctor = function(){};

  var _ = function(obj){
    if(obj instanceof _){
      return obj;
    }
    if(!(this instanceof _)){
      return new _(obj);
    }
    this._wrapped = obj;
  };

  if(typeof exports !== 'undefined'){
    if(typeof module !== 'undefined' && module.exports){
      exports = module.exports = _;
    }
    exports._ = _;
  }else{
    root._ = _;//上面的if部分没太看明白，不过感觉应该和此处的功能类似。将上面定义的_函数作为window对象的属性暴露出去成为全局变量。
  }

  _.VERSION = '1.8.3';

  // 不以下划线开头的函数均为内部方法
  var optimizeCb = function(func, context, argCount){

    if(context === void 0){
      return func;
    }//没有给上下文则成为全局函数

    switch(argCount == null ? 3 : argCount){
      case 1: return function(value){
        return func.call(context, value);
      };
      case 2: return function(value, other){
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection){
        return func.call(context, value, index, collection);
      };//从这个形式来看，这个函数是专门用来构建类似map函数这种类型的
      case 4: return function(accumulator, value, index, collection){
        return func.call(context, accumulator, value, index, collection);
      };
    }
    // 下面的代码能够实现上述的switch功能
    // K-从参考中得知，call比apply运行速度快，因为apply在运行前要对作为参数的数组进行一系列的检验和深拷贝，而call没有
    // 如此写则下面的代码适用于参数为5及5个以上的情况，目测比较少见
    return function(){
      return func.apply(context, arguments);
    }
  }

  // 针对不存在的值，函数，对象等进行不同情况出里的路由函数
  var cb = function(value, context, argCount){
    if(value == null) return _.identity;
    if(_.isFunction(value)) return optimizeCb(value, context, argCount);
    if(_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  
}.call(this));

