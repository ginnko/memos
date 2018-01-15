/*==========================================说明==================================================*/ 
// 标识：
// Q: 问题
// T：想法
// K: 知识点
// Tip: 技巧



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
  // 这个函数主要用来指定上下文
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

  // 作为参数传入的iteratee是个函数
  // 类似于forEach
  // 在传入的原数组或对象上直接处理
  _.each = _.forEach = function(obj, iteratee, context){
    iteratee = optimizeCb(iteratee, context);//注意这种用法！不会发生变量错误
    var i, length;
    if(isArrayLike(obj)){//默认不会传入{length: 10}这种数据
      for(i = 0, length = obj.length; i < length; i++){
        iteratee(obj[i], i, obj);
      }
    }else{
      var keys = _.keys(obj);
      for(i = 0, length = keys.length; i < length; i++){
        iteratee(obj[keys[i]], keys[i], obj);//分别是 值、键、对象（值、位置、数组）
      }
    }

    return obj;//此处返回处理后的对象，可供链式调用
  }

  // 类似于map
  // 返回一个新的结果，原数组或对象没有改变
  // 注意，此处的iteratee没有带参数
  // 这一步操作会对iteratee进行进一步操作
  _.map = _.collect = function(obj, iteratee, context){
    iteratee = cb(iteratee, context);

    // 精彩的来了！Tip-
    var keys = !isArrayLike(obj) && _.keys(obj),//第一步，如果obj是对象，第一个判断为真，keys的取值为obj的所有键值；如果是数组，第一个判断为false，即为keys的取值
        length = (keys || obj).length,//如果obj是数组，即keys为false时，length的取值为数组元素的数量；如果obj是对象，length的取值是对象键值组成的数组的元素数量
        results = Array(length);
    
    for(var index = 0; index < length; index++){
      var currentKey = keys ? keys[index] : index;//一个key值控制了所有的后续操作，厉害！
      results[index] = interatee(obj[currentKey], currentKey, obj);
    }

    return results;
  }

  // 内部函数，用来构建reduce、reduceRight
  function createReduce(dir){
    // Q-此处为何要把iterator单独定义出来？直接放进下面的函数里也是可以的吧？单独拿出来有何用意？这也算闭包吧？
    function iterator(obj, iteratee, memo, keys, index, length){
      for(; index >= 0 && index < length; index += dir){
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);//对memo进行累计迭代
      }
      return memo;
    }

    //reduce、reduceRight可以传入4个参数，memo为初始值，context为iteratee中的this指向，这两个参数为可选。 
    return function(obj, iteratee, memo, context){
      iteratee = optimizeCb(iteratee, context, 4);

      // 此处又使用了对数组和对象的短路操作
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0? 0 : length - 1;

      // 处理没有初始累加值的情况
      if(arguments.length < 3){
        memo = obj[keys? keys[index] : index];
        index += dir;
      }

      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  _.reduce = _.foldl = _.inject = createReduce(1);
  _.reduceRight = _.foldr = createReduce(-1);

  _.find = _.detect = function(obj, predicate, context){
    var key;
    if(isArrayLike(obj)){
      key = _.findIndex(obj, predicate, context);
    }else{
      key = _.findKey(obj, predicate, context);
    }

    // 此处设计的很巧妙啊！如果key没有满足条件，则默认返回undefined
    // 此处的-1猜测是上面的_.findIndex和_findKey两个函数的返回值
    if(key !== void 0 && key !== -1) return obj[key];
  };

  _.filter = _.select = function(obj, predicate, context){
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list){
      if(predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // _.filter函数的补集函数
  // !!!_.negate()函数应该是个很有意思的函数！！！

  _.reject = function(obj, predicate, context){
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  _.every = _.all = function(obj, predicate, context){
    predicate = cb(predicate, context);

    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;

    for(var index = 0; index < length; index++){
      var currentKey = keys > keys[index] : index;
      if(!predicate(obj[currentKey], currentKey, obj))
      return false;
    }
    return true;
  };

  _.some = _.any = function(obj, predicate, context){
    predicate = cb(predicate, context);

    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for(var index = 0; index < length; index++){
      var currentKey = keys ? keys[index] : index;
      if(predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard){
    if(!isArrayLike(obj)) obj = _.values(obj);
    
    //此处的guard是干嘛使的？ 
    if(typeof fromIndex != 'number' || guard) fromIndex = 0;

    return _.indexOf(obj, item, fromIndex) >= 0;
  }

  _.invoke = function(obj, method){
    var args = slice.call(arguments, 2);

    var isFunc = _.isFunction(method);

    // Q-对这个函数不甚明了，感觉除了多传入的参数能作为回调函数的参数使用外，和map函数没有什么大的区别
    return _.map(obj, function(value){
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  }

  // 这个函数中对map的使用，真是对map函数有了更深的认识
  // _.property（）是一个闭包，会返回一个函数
  _.pluck = function(obj, key){
    return _.map(obj, _.property(key));
  };

  // attrs是键值对
  _.where = function(obj, attrs){
    return _.filter(obj, _.matcher(attrs));
  };

  // 从_.where和_.findWhere可以看出，_.filter和_.find这两个函数是更基础的函数
  _.findWhere = function(obj, attrs){
    return _.find(obj, _.matcher(attrs));
  };

  // 
  _.max = function(obj, iteratee, context){
    // 此处这个-Infinity很好用啊！
    var result = -Infinity, lastComputed = -Infinity, value, computed;

    if(iteratee == null && obj != null){
      obj = isArrayLike(obj) ? obj : _.values(obj);

      for(var i = 0, length = obj.length; i < length; i++){
        value = obj[i];
        if(value > result){
          result = value;
        }
      }
    }else{
      iteratee = cb(iteratee, context);

      _.each(obj, function(value, index, list){
        computed = iteratee(value, index, list);
        if(conputed > lastComputed || computed === -Infinity && result === -Infinity){
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };


  _.min = function(obj, iteratee, context){
    var result = Infinity, lastComputed = Infinity, value, computed;
    
    if(iteratee == null && obj !==null){
      obj = isArrayLike(obj) ? obj : _.values(pbj);
      for(var i = 0, length = obj.length; i < length; i++){
        value = obj[i];
        if(value < result){
          retult = value;
        }
      }
    }else{
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list){
        computed = iteratee(value, index, list);
        if(computed < lastComputed || computed === Infinity && result === Infinity){
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // 这个函数使用Fisher-Yats随机算法
  // 参考这里的说明：https://github.com/hanzichi/underscore-analysis/issues/15
  // 其中_.random(0, index);返回一个0～index之间的随机整数
  _.shuffle = function(obj){
    var set = isArrayLike(obj) ? obj : _values(obj);
    var length = set.length;

    var shuffled = Array(length);

    for(var index = 0, rand; index < length; index++){
      rand = _.random(0, index);
      if(rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];//补充新值进入这个圈子
    }
    return shuffled;
  };

  _.sample = function(obj, n, guard){
    if(n == null || guard){
      if(!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  _.sortBy = function(obj, iteratee, context){
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list){
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right){
      var a = left.criteria;
      var b = right.criteria;
      if(a !== b){
        if(a > b || a === void 0) return 1;
        if(a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };


}.call(this));
xinzhi