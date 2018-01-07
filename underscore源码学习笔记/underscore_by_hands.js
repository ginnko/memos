/*==========================================说明==================================================*/ 
// 标识：
// Q: 问题
// T：想法
// K: 知识点



/*===========================================正文===============================================*/ 
// Q-整个内容被定义在一个立即执行函数中，以.call()的形式调用，这个在其他代码中作为第三方库如何使用？
// T-可以直接用script标签引入，然后在其他js文件中直接使用？
(function(){

  /*++++++++++++++++++++++++++++++++++基本准备阶段++++++++++++++++++++++++++++++++++++*/ 


  var root = this;
  var preiousUnderscore = root._;

  // 一些简写
  var ArrayProto = Array.prototype, ObjProto = object.prototype, FuncProto = Function.prototype;
  var push = ArrayProto.push,
      silce = ArrayProto.slice,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;
  
  var nativeIsArray = Array.isArray,
      nativeKsys = Object.keys,//Object.keys() 方法会返回一个由一个给定对象的自身可枚举属性组成的数组 
      nativeBind = FuncProto.bind,
      nativeCreate = object.create;


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
  
  
  _.iteratee = function(value, context){
    return cb(value, context, Infinity);//Q-此处为何要用Infinity?
  };

  // 用来创建对象键值对复制函数的函数
  var createAssigner = function(keysFunc, undefinedOnly){
    return function(obj){
      var length = arguments.length;
      if(length < 2 || obj == null) return obj;
      for(var index = 1; index < length; index++){
        var source = arguments[index],
        keys = keysFunc(source),//此处的keysFunc用来提取对象的key值
        l = keys.length;
        for(var i = 0; i < l; i++){
          var key = keys[i];
          if(!undefinedOnly || obj[key] === void 0){//这块代码用来判断有相同key值时，是否覆盖前一个已有的键值对
            obj[key] = source[key];
          }
        }
      }
    return obj;
    };
  };

  // 创建一个可以指定原型对象的的新对象
  var baseCreate = function(prototype){
    if(!_.isObject(prototype)) return {};
    // 创建对象的方法1
    if(nativeCreate) return nativeCreate(prototype);
    // 创建对象的方法2
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;//此处重设了Ctor函数的原型对象为空，以便再次调用baseCreate函数能够正常工作
    return result;
  };

  // 创建能够返回指定键值的任意对象的属性值的函数
  var property = function(key){
    return function(obj){
      return obj == null ? void 0 : obj[key];
    };
  };

  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

  // property函数的第一次使用：获取数组或类数组的length属性，简直好用！
  var getLength = property('length');

  // 类数组判断函数
  // K-类数组：拥有length属性，并且length属性值为number类型，大于0且小于js能表达的最大正数字
  // 包括数组、arguments、HTML Collection 以及 NodeList
  // 包括{length: 10}这种对象
  // 包括字符串、函数
  var isArrayLike = function(collection){
    var length = getLength(collection);
    return typeof length == 'number' && length > 0 && length <= MAX_ARRAY_INDEX;//三个判断条件：length属性是number类型，大于零，小于最大正值
  };


  /*+++++++++++++++++++++++++++++++++++以下为数组或对象的扩展方法++++++++++++++++++++++++++++++++++*/ 




}.call(this));

