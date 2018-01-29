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
      nativeCreate = Object.create;


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
  // 传入的参数是一个原型对象(对象!)
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
        if(computed > lastComputed || computed === -Infinity && result === -Infinity){
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

  // behavior是分类规则
  var group = function(behavior){
    return function(obj, iteratee, context){
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index){
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

_.groupBy = group(function(result, value, key){
  if(_.has(result, key)){
    result[key].push(value);
  }else{
    result[key] = [value];//此处初始化
  }
});

_.indexBy = group(function(result, value, key){
  result[key] = value;
});

_countBy = group(function(result, value, key){
  if(_.has(result, key)){
    result[key]++;
  }else{
    result[key] = 1;//此处初始化
  }
});


_.toArray = function(obj){
  if(!obj){
    return [];
  }
  if(_.isArray(obj)){
    return slice.call(obj);
  }
/*   _.identity = function(value) {
  return value;
};*/
  if(isArrayLike(obj)){
    return _.map(obj, _.identity);
  }
  return _.values(obj);
  /*  _.values = function(obj) {
    // 仅包括 own properties
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
};*/ 
};

_.size = function(obj){
  if(obj == null){
    return 0
  }
  return isArrayLike(obj) ? obj.length : _.keys(obj).length;
};

_.partition = function(obj, predicate, context){
  predicate = cb(predicate, context);
  var pass = [], fail = [];
  _.each(obj, function(value, key, obj){
    (predicate(value, key, obj) ? pass : fail).push(value);
  });
  return [pass, fail];//这种字面量形式是合法的。
};

/*+++++++++++++++++++++++++++++++++++以下为数组的扩展方法++++++++++++++++++++++++++++++++++*/ 

_.first = _.head = _.take = function(array, n ,guard){
  if(array == null){
    return void 0;
  }
  // The **guard** check
  // allows it to work with `_.map`.
  if(n == null || guard){//Q-就不明白了，这个guard到底是干嘛的，好几个地方都出现了
    return array[0];
  }
  return _.initial(array, array.length - n);
};

// 剔除后n个元素
_.initial = function(array, n, guard){
  return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1: n)));
};

_.last = function(array, n, guard){
  if(array == null){
    return void 0;
  }
  if(n == null || guard){
    return array[array.length - 1];
  }
  return _.rest(array, Math.max(0, array.length - n));
};

// 剔除前n个元素
_.rest = _.tail = _.drop = function(array, n, guard){
  return slice.call(array, n == null || guard ? 1 : n);
};

// 假值：false null undefined '' NaN 0
_.compact = function(array){
  return _.filter(array, _.identity);//_.identity在_.filter()中作为一个if条件的判断结果，假值返回false
};


//数组展开函数
// input：数组或类数组
// shallow：布尔值，true表示只展开一层
// strict：布尔值，true表示不保存非数组元素
// startIndex：表示处理的起始位置
// [[1, 2, [3, 4]]]

var flatten = function(input, shallow, strict, startIndex){
  var output = [], idx = 0;
  for(var i = startIndex || 0, length = getLength(input); i < length; i++){
    var value = input[i];
    if(isArrayLike(value) && (_.isArray(value) || _.isArguments(value))){
      if(!shallow){
        value = flatten(value, shallow, strict);
      }
      var j = 0, len = value.length;
      output.length += len;
      while(j < len){
        output[idx++] = value[j++];
      }
    }else if(!strict){
      output[idx++] =  value;
    }
  }
  return output;
};

_.flatten = function(array, shallow){
  return flatten(array, shallow, false);//strict为false表示可以保存类数组的元素
};

_without = function(array){
  return _.difference(array, slice.call(arguments, 1));
};


// 数组去重
// 如果第二个参数‘isSorted’为true，说明事先已经知道数组有序，程序会跑一个更快的算法（一次线性比较，元素和数组前一个元素比较即可）
// 如果有第三个参数iteratee，则对数组每个元素迭代，对迭代后的结果进行去重，返回去重后的数组
// 暴露的api中没有context参数
// _.uniq([1, 2, 1, 4, 1, 3]);
// => [1, 2, 4, 3]
_.uniq = _.unique = function(array, isSorted, iteratee, context){
  if(!_.isBoolean(isSorted)){
    context = iteratee;
    itaratee = isSorted;
    isSorted = false;
  }
  if(iteratee != null){
    iteratee = cb(iteratee, context);
  }

  var result = [];
  var seen = [];//数组形式的seen用来保存迭代过后的值

  for(var i = 0, length = getLength(array); i < length; i++){
    var value = array[i],
        computed = iteratee ? iteratee(value, i, array) : value;
    if(isSorted){
      // 如果是有序数组，只需让当前元素和上一个数组进行比较，此时seen已不再是一个数组，而直接保存了一个值
      //下面的!i表示当i === 0的情况下，作为第一个元素直接推入结果数组中
      if(!i || seen !== computed){
        result.push(value);
      }
      seen = computed;//让seen保存本次值，和下一次值进行比较
    }else if(iteratee){
      if(!_.contains(seen, computed)){
        seen.push(computed);//注意seen保存的是迭代后的值
        result.push(value);//result保存的是原值
      }
    }else if(!_.contains(result, value)){
      result.push(value);//其实在没有迭代函数的情况下，数组排序与否都可以通过这个算法进行去重，只不过排序会走一个更快的算法
    }
  }
  return result;
};

// _.union函数 先对数组中的数组展开一层，只保存值，然后去重
_.union = function(){
  return _.uniq(flatten(arguments, true, true));
};

// Tip-_.intersection这个函数中的外部for循环套内部for循环进行条件判断，用continue和break进行
// 循环控制的方法要注意下
_.intersection = function(array){
  var result = [];
  var argsLength = arguments.length;
  for(var i = 0, length = getLength(array); i < length; i++){
    var item = array[i];
    if(_.contains(result, item)) continue;
    for(var j = 1; j < argsLength; j++){
      if(!_.contains(arguments[j], item)){
        break;//跳出内部的for循环，进去外部的for循环
      }
    }
    if(j === argsLength){
      result.push(item);
    }
  }
  return result;//结果中元素的顺序是按第一个数组的元素顺序
};

_.difference = function(array){
  var rest = flatten(arguments, true, true, 1);//展开一层，不保存类数组型的值
  return _.filter(array, function(value){
    return !_.contains(rest, value);
  });//array中rest中没有的元素组成的数组
};

// 传入_.zip和_.unzip的参数的不同：传入第一个函数的参数可以是n多个独立的数组，传入第二个函数的参数需要是由多个数组组成的元素的数组
_.zip = function(){
  return _.unzip(arguments);
};

// array参数是一个包含数组的数组
_.unzip = function(array){
  var length = array && _.max(array, getLength).length || 0;//取得数组中最长的数组
  var result = Array(length);
  for(var index = 0; index < length; index++){
    result[index] = _.pluck(array, index);//每个数组的相同index组成一个新的数组并推入result中
  }
  return result;
};

// 如果没有values参数
// list参数是一个数组，其中的元素是包含两个元素的数组
// 如果有values参数
// 那么list和values两个数组的元素数目要相同
_.object = function(list, values){
  var result = {};
  for(var i = 0, length = getLength(list); i < length; i++){
    if(values){
      result[list[i]] = values[i];
    }else{
      result[list[i][0]] = list[i][1];
    }
  }
  return result;
};

// dir=1，从前往后找
// dir=-1，从后往前找
function createPredicateIndexFinder(dir){
  return function(array, predicate, context){
    predicate = cb(predicate, context);

    var length = getLength(array);
    var index = dir > 0 ? 0 : length - 1;
    for(; index >= 0 && index < length; index +=dir){
      if(predicate(array[index], index, array)){
        return index;
      }
    }
    return -1;
  };
};

_.findIndex = createPredicateIndexFinder(1);

_.findLastIndex = createPredicateIndexFinder(-1);

// 返回一个value应该排进一个有序数组的index值
_.sortedIndex = function(array, obj, iteratee, context){
  iteratee = cb(iteratee, context, 1);
  var value = iteratee(obj);
  var low = 0, high = getLength(array);

  while(low < high){
    var mid = Math.floor((low + high) / 2);
    if(iteratee(array[mid]) < value){
      low = mid + 1;
    }else{
      high = mid;
    }
  }
  return low;
};


// 后面将要定义的函数
// _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
// _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);
function createIndexFinder(dir, predicateFind, sortedIndex){
  return function(array, item, idx){
    var i = 0, length = getLength(array);
    // 如果idx是数字，规定数组不是有序排序，不能使用二分法，此处进行的设置是设定查询的起始点
    if(typeof idx == 'number'){
      if(dir > 0){
        i = idx >= 0 ? idx : Math.max(idx +length, i);
      }else{
        length = idx >= 0? Math.min(idx + 1, length) : idx + length + 1;
      }
      // 如果idx不是数字，说明是顺序排序的数组，可以用二分法，也就是可以使用sortedIndex函数
    }else if (sortedIndex && idx &&length){
      idx = sortedIndex(array, item);
      return array[idx] === item ? idx : -1;
    }
    // 针对NaN的情况单独进行的查找
    if(item !== item){
      idx = predicateFind(slice.call(array, i, length), _.isNaN);
      return idx >= 0? idx + i : -1;
    }
    // 排除NaN后针对不能使用二分法的情况使用循环遍历
    for(idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += idr){
      if(array[idx] === item){
        return idx;
      }
    }
    return -1;
  };
}

// 调用方式: _.indexOf(array, value, [isSorted]);
// 找到数组array中value第一次出现的位置,返回其下下标
// 其中isSorted是布尔值(感觉其实不是数字类型的能转换为true的任意类型都可以)时,也就是事先明确知道数组时有序的
// isSorted是数值时,走的是遍历算法,不会使用_.sortedIndex函数
_.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);

// 倒序查找
// 调用方式:_.lastIndexOf(array, value, [fromIndex]);
// 其中[fromIndex]参数表示从倒数第几个开始往前找
// 不可用二分法查找,即便传入有序数组,也使用的是遍历算法
_.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

// 返回某个范围,某个步长下的顺序整数组成的数组
_.range = function(start, stop, step){
  if(stop == null){
    stop = start || 0;
    start = 0;
  }
  step = step || 1;

  var length = Math.max(Math.ceil((stop - start) / step), 0); //Math.ceil()返回舍入的整数

  var range = Array(length);

  for(var idx = 0; idx < length; idx++, start += step){
    range[idx] = start;
  }
  return range;

};

/*+++++++++++++++++++++++++++++++++++以下为函数的扩展方法++++++++++++++++++++++++++++++++++*/ 

// new操作符创建对象可以分为四个步骤:
// 1.创建一个空对象
// 2.将所创建对象的__proto__属性值设成构造函数的Prototype属性值
// 3.执行构造函数中的代码,构造函数中的this指向该对象
// 4.返回该对象(除非构造函数中返回一个对象)
// 详细参考: http://www.cnblogs.com/zichi/p/4392944.html
var executeBound = function(sourceFunc, boundFunc, context, callingContext, args){
  // 作为普通函数调用执行if条件中的代码
  if(!(callingContext instanceof boundFunc)){
    return sourceFunc.apply(context, args);
  }

  // new调用绑定后的函数执行下述代码
  // self是sourceFunc的实例,继承了它的原型链
  // baseCreat内部是采用new关键字创建的对象
  var self = baseCreate(sourceFunc.prototype);

  // 构造函数的返回值
  // 如果sourceFunc没有返回值则result为undefined
  var result = sourceFunc.apply(self, args);

  if(_.isObject(result)) return result;

  return self;
};


// 原生bind函数(https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)

// 下面是关于一个bind的简单模拟
// 其中在bind中使用that保存this来传递this指向
// bind方法是定义在Function.prototype上的
// 而getCount实际就是Function的实例
// 所以that保存的实际是obj.getCount
// var obj = {
//   a: 1,
//   b: 2,
//   getCount: function(c, d) {
//     return this.a + this.b + c + d;
//   }
// };
 
// Function.prototype.bind = Function.prototype.bind || function(context) {
//   var that = this;
//   return function() {
//     // console.log(arguments); // console [3,4] if ie<6-8>
//     return that.apply(context, arguments);
 
//   }
// }
// window.a = window.b = 0;
// var func = obj.getCount.bind(obj);
// console.log(func(3, 4));  // 10


// _.bind(function, object, *arguments)
// 将func中的this指向context对象
// *arguments会被当做function的参数传入

// 使用方法:
// var func = function(greeting){ return greeting + ': ' + this.name };
// func = _.bind(func, {name: 'moe'}, 'hi');
// func();
// => 'hi: moe'


_.bind = function(func, context){
  // 这个判断的意思是如果浏览器支持原生bind方法,且func上的bind方法没有被重写
  // 使用原生bind不用考虑func是否是函数的问题
  if(nativeBind && func.bind === nativeBind){
    return nativeBind.apply(func, slice.call(arguments, 1));
  }

  if(!_.isFunction(func)){
    throw new TypeError('Bind must be called on a function');
  }

  var args = slice.call(arguments, 2);//将arguments中从index=2开始到后续的元素转成数组

  // _.bind返回一个函数!!!
  // 这个函数可以继续接收参数,也就是这个地方args.concat(slice.call(arguments))
  // 不太理解这里的this和bound
  // 明白了!返回的这个函数如果用new来调用,
  // 这个函数就是个构造函数
  // this指向的当然是新创建的这个对象
  // 既然这个对象是由这个构造函数创建的
  // 当然使用(callingContext instanceof boundFunc)进行判断返回的是true
  // 而规范中规定当用new 调用绑定后的函数时,bind的第一个参数会失效
  // 还要对this多了解下,迷糊!
  
  // 此处为了能使用bound而使用了函数定义形式
  var bound = function(){
    return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
  };

  // 这是个闭包啊!!!
  return bound;
};



// 使用1
// var subtract = function(a, b) { return b - a; };
// sub5 = _.partial(subtract, 5);
// sub5(20);
// => 15
// 使用2:placeholder
// subFrom20 = _.partial(subtract, _, 20);
// subFrom20(5);
// => 15

// _.partial函数的返回值是一个函数
// 任何类型都可以传入这个函数作为参数
// 这些参数将成为func的参数
_.partial = function(func){
  var boundArgs = slice.call(arguments, 1);

  // bound是个闭包
  var bound = function(){
    var position = 0, length = boundArgs.length;
    var args = Array(length);
    for(var i = 0; i < length; i++){
      // 如果在_.partial()中传入了_,则使用返回函数中的参数进行填补
      args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
    }
    while(position < arguments.length){
      args.push(arguments[position++]);
    }
    // 执行的是executeBound中的这部分代码:
    // if(!(callingContext instanceof boundFunc)){
    //   return sourceFunc.apply(context, args);
    // }
    // 同样传递了this指向
    return executeBound(func, bound, this, this, args);
  };
  return bound;
};


// 调用方法
// var buttonView = {
//   label  : 'underscore',
//   onClick: function(){ alert('clicked: ' + this.label); },
//   onHover: function(){ console.log('hovering: ' + this.label); }
// };
// _.bindAll(buttonView, 'onClick', 'onHover');
// When the button is clicked, this.label will have the correct value.
// jQuery('#underscore_button').on('click', buttonView.onClick);


_.bindAll = function(obj){
  var i, length = arguments.length, key;
  if(length <= 1){
    throw new encodeURIComponent('bindAll must be passed function names');
  }
  for(i = 1; i < length; i++){
    key = arguments[i];
    obj[key] = _.bind(obj[key], obj);
  }
  return obj;
};


// 参数func,hasher都是函数
// 如果传入hasher,则用hasher来计算key值,否则直接使用key值
// 适合需要反复求解的情况
// 使用方法:
// var fibonacci = _.memoize(function(n) {
//   return n < 2 ? n: fibonacci(n - 1) + fibonacci(n - 2);
// });


_.memoize = function(func, hasher){

  //此处为了使用memoize的属性cache而使用了函数定义形式
  // 而不是直接返回一个匿名函数
  // 真是灵活的用法
  var memoize = function(key){
    var cache = memoize.cache;
    var address = '' + (hasher ? hasher.apply(this, aguments) : key);

    // _.has(object, key);
    // 返回一个布尔值

    if(!_.has(cache, address)){
      cache[address] = func.apply(this, arguments);
    }
    return cache[address];
  };

  //此处没有使用一个独立的对象来保存计算结果
  memoize.cache = {};
  return memoize;
};

// 封装延迟触发某时间
_.delay = function(func, wait){
  var args = slice.call(arguments, 2);
  return setTimeout(function(){
    // 需要看一下apply的实现,对于args为空时的处理是如何的
    return func.apply(null, args);
  }, wait);
};


//_.partial使得方法可以方法能够设置默认值
// wait参数设置为 1
// 感觉这个函数似乎没什么大用处啊...
_.defer = _.partial(_.delay, _, 1);


// throttle:节流
_.throttle = function(func, wait, options){
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if(!options){
    opstions = {};
  }
  var later = function(){
    previous = 
  };
};


















}.call(this));
