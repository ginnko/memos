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
  var previousUnderscore = root._;

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
var c = function(sourceFunc, boundFunc, context, callingContext, args){
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
// 函数的节流使得连续的函数执行,变为固定时间段间断地执行


// 返回一个传入函数func的throttle版本
// options:
// 1.不填-正常执行
// 2.{leading: false}-传入的func不会立即触发,要等待一个wait才第一次触发
// 3.{trailing: false}-最后一次回调不会触发

// 调用方法:
// var throttled = _.throttle(updatePosition, 100);
// $(window).scroll(throttled);

// 实现方式1:
// 用时间戳来判断是否已经到回调该执行的事件,记录上次执行的时间戳,然后每次触发scroll事件执行回调,
// 回调中判断当前时间戳距离上次执行时间戳的间隔是否已经达到设置的时间,如果是,则执行,并更新上次执行
// 的时间戳,如此循环.

// 实现方式2:
// 使用定时器,比如当scroll事件刚触发时,打印一个hello world,然后设置个1000ms的定时器,以后每次
// 触发scroll事件触发回调,如果已经存在定时器,则回调不执行方法,直到定时器触发,handler被清除,然后
// 重新设置定时器.


_.throttle = function(func, wait, options){
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if(!options){
    opstions = {};
  }

  // later是实现方式2中定时器的回调函数
  var later = function(){
    // Q-感觉previous可以直接设置为_.now()的返回值,不需要此处的判断..何处会用到这个判断?
    // 此处设置的是上一次实际的执行时间
    previous = opstions.leading === false ? 0: _.now();
    timeout = null;
    result = func.apply(context, args);
    if(!timeout){
      // 此处的context = args = null防止内存泄露?
      context = args = null;
    }
  };
  return function(){
    // 此处设置的是新一次开始的时间
    var now = _.now();
    // Q-感觉此处不需要!previous的判断...什么情况会用到这个判断?
    if(!previous && options.leading === false){
      previous = now;
    }
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;

    //如果设置{leading: false}则只会执行B部分,也就是使用定时器来实现节流的效果
    //如果设置{trailing: false}则只会执行A部分,也就是使用时间戳来实现节流的效果
    //如果没有设置这个位置的参数,则A部分会执行一次,后续由B部分执行(比如鼠标的连续移动,如果中间停顿大于wait,则又是1次A,后续都是B)
/*=============================A==============================*/ 
    if(remaining <= 0 || remaining > wait){
      // 感觉紧下面这段if代码没什么用啊...这个涉及到队列执行顺序?
      // 只要执行B,timeout就会被重置为null,如果不执行B,timeout一开始就是null,也会一直保存的,这是用在什么情况下?
      // 发生的情况:上次B回调还未执行&&本次再次触发事件&&本次remaining<=0?
      if(timeout){
        clearTimeout(timeout);
        timeout = null;
      }
      // 此处设置本次执行的事件戳
      previous = now;
      result = func.apply(context, args);

      // 此处设置context = args = null是为了防止内存泄露,使用闭包时要特别注意这个!
      if(!timeout){
        context = args = null;
      }
/*============================================================*/ 
/*============================B================================*/ 
    }else if(!timeout && options.trailing !== false){
      timeout = setTimeout(later, remaining);
    }
/*============================================================*/ 
    return result;
  };
};



// 函数去抖:连续事件触发结束后只触发一次
// 调用方式1:
// _.debounce(function(){}, 1000)
// 连续事件结束后的1000ms后触发

// 调用方式2:
// _.debounce(function(){}, 1000, true)
// 连续时间出发后立即触发(此时会忽略第二个参数)
_.debounce = function(func, wait, immediate){
  var timeout, args, context, timestamp, result;
  var later = function(){
    var last = _.now() - timestamp;
    // 如果没有到触发点则继续设置定时器
    // 这样连续设定定时器,不会都注册在队列里么
    if(last < wait && last >= 0){
      timeout = setTimeout(later, wait - last);
    }else{
      timeout = null;
      if(!immediate){
        result = func.apply(context, args);
        if(!timeout){
          context = args = null;
        }
      }
    }
  };
  return function(){
    context = this;
    args = arguments;
    timestamp = _.now();
    var callNow = immediate && !timeout;
    if(!timeout){
      timeout = setTimeout(later, wait);
    }
    if(callNow){
      result = func.apply(context, args);
      context = args = null;
    }
    return result;
  };
};

// throttle 和 debounce 的应用场景应该是分的很清楚的

// 按一个按钮发送 AJAX：给 click 加了 debounce 后就算用户不停地点这个按钮，也只会最终发送一次；如果是 throttle 就会间隔发送几次
// 监听滚动事件判断是否到页面底部自动加载更多：给 scroll 加了 debounce 后，只有用户停止滚动后，才会判断是否到了页面底部；如果是 throttle 的话，只要页面滚动就会间隔一段时间判断一次
// throttle 和 debounce 是解决请求和响应速度不匹配问题的两个方案。二者的差异在于选择不同的策略。




// 关于partial的使用

// 使用1
// var subtract = function(a, b) { return b - a; };
// sub5 = _.partial(subtract, 5);
// sub5(20);
// => 15

// 使用2:placeholder
// subFrom20 = _.partial(subtract, _, 20);
// subFrom20(5);
// => 15

// _.wrap的使用
// var hello = function(name) { return "hello: " + name; };
// hello = _.wrap(hello, function(func) {
//   return "before, " + func("moe") + ", after";
// });
// hello();
// => 'before, hello: moe, after'
// 用途:可以用来设置代码在某一部分代码前面运行还是在后面运行

_.wrap = function(func, wrapper){
  return _.partial(wrapper, func);
};

// 返回一个predicate方法的对立方法
// 该方法可以对原来的predicate的迭代结果值取补集
// 参数predicate是个函数
_.negate = function(predicate){
  return function(){
    return !predicate.apply(this, arguments);
  };
};

// 调用方式
// var greet    = function(name){ return "hi: " + name; };
// var exclaim  = function(statement){ return statement.toUpperCase() + "!"; };
// var welcome = _.compose(greet, exclaim);
// welcome('moe');
// => 'hi: MOE!'

// 过程分析
// args[start].apply(this, arguments);中args[start]指代的函数是exclaim,arguments是['moe']
// 然后执行while循环,只执行一次
// result = args[0].call(this, result);
// 'hi: MOE!' = greet.call(this, 'MEO');

// 传入的函数都需要是有明确返回值的
_.compose = function(){
  var args = arguments;
  var start = args.length - 1;
  return function(){
    var i = start;
    var result = args[start].apply(this, arguments);
    // 此处while循环使用了隐式转换
    while(i--){
      result = args[i].call(this, result);
    }
    return result;
  };
};

// 从第times触发之后开始执行
_.after = function(times, func){
  return function(){
    if(--times < 1){
      return func.apply(this, arguments);
    }
  };
};

// 前times-1次是将参数带入重新计算的
// 从第times次开始始终返回第times-1次的值
_.before = function(times, func){
  var memo;
  return function(){
    if(--times > 0){
      memo = func.apply(this, arguments);
    }
    if(times <= 1){
      func = null;
    }
    return memo;
  };
};

// 函数最多只能被调用一次
_.once = _partial(_.before, 2);


/*+++++++++++++++++++++++++++++++++++以下为函数的扩展方法++++++++++++++++++++++++++++++++++*/ 

// ie<9下不能用for key in 来枚举对象的某些key！！！
// 下面这个表示
// 重写了对象的toString方法,这个key值就不能在ie<9下用for in枚举到
// 据此可以判断是否在ie < 9浏览器环境中

var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');

// ie<9下不能用for in来枚举的key值集合
var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString', 
                          'propertyIsEnumerable', 'hasOwnProperty',
                           'toLocaleString'];

function collectNonEnumProps(obj, keys){
  var nonEnumIdx = nonEnumerableProps.length;
  // 单独写constructor,其他的nonEnumerableProps都是方法,constructor表示对象的构造函数
  var constructor = obj.constructor;
  // Q-此处有疑问啊,isFunction都做了那些检查?待查.
  var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

  var prop = 'constructor';
  if(_.has(obj, prop) && !_.contains(keys, prop)){
    keys.push(prop);
  }

  while(nonEnumIdx--){
    prop = nonEnumerableProps[nonEnumIdx];
    // 收集重写了原型链上的属性
    if(prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)){
      keys.push(prop);
    }
  }

};

// 仅返回对象本身的可枚举属性组成的数组

_.keys = function(obj){
  if(!_.isObject(obj)){
    return [];
  }
// Object.keys()
// 返回一个所有元素为字符串的数组，其元素来自于从给定的对象上面可直接枚举的属性
// Objext.keys()仅返回对象本身的可枚举属性

if(nativeKeys){
    return nativeKeys(obj);
  }

  var keys = [];

  // in操作符返回对象本身和原型链上的属性

  for(var key in obj){
    // _.has()函数有猫腻，嘿嘿
    // 感觉去除原型链上的属性就在这个_.has()属性上
    if(_.has(obj, key)){
      keys.push(key);
    }
  }

  // 针对ie<9的情况
  if(hasEnumBug){
    collectNonEnumProps(obj, keys);
  } 

  return keys;

};

// 不仅是本身的可枚举属性
// 还包括原型链上继承的属性
_.allkeys = function(obj){
  if(!_.isObject(obj)){
    return [];
  }

  var keys = [];
  for(var key in obj){
    keys.push(key);
  }

  if(hasEnumBug){
    collectNonEnumProps(obj, keys);
  }

  return keys;

};

// 将一个对象上的所有value值放入一个数组并返回
// 仅限对象本身的可枚举属性
// 不包含原型链上的
_.values = function(obj){
  var keys = _.keys(obj);
  var length = keys.length;
  //Q-js中的数组数量不是能动态改变的么,为毛这个库里的Array很多地方都主动设置大小
  var values = Array(length);
  for(var i = 0; i < length; i++){
    values[i] = obj[keys[i]];
  }
  return values
};

// 专门针对对象的map版本?
// 上面的_.map()已经能做到同时处理数组和对象了吧
// 为何此处要单独再写一个对象版本?
// 返回一个传入对象运算后的值组成的对象,原对象不受影响

_.mapObject = function(obj, iteratee, context){
  iteratee = cb(iteratee, context);
  var keys = _.keys(obj),//此处获取的不包含原型链上的属性
      length = keys.length,
      results = {},
      currentKey;
  
  for(var index = 0; index < length; index--){
    currentKey = keys[index];
    results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
  }
  return results;;
};

  // _.pairs({one: 1, two: 2, three: 3});
  // => [["one", 1], ["two", 2], ["three", 3]]
_.pairs = function(obj){
  var keys = _.keys(obj);
  var length = keys.length;
  var pairs = Array(length);//此处又是手动设置了结果数组的大小
  for(var i = 0; i < length; i++){
    pairs[i] = [keys[i], obj[keys[i]]];//我自己写代码好像很少用到数组的这种书写形式
  }
  return pairs;
};

// 将一个对象的属性和属性值对调,并返回一个新的对象,原对象没有影响
_.invert = function(obj){
  var result = {};
  var keys = _.keys(obj);
  for(var i = 0, length = keys.length; i < length; i++){
    result[obj[keys[i]]] = keys[i];
  }
  return result;
};

// 求豆麻袋!
// in 可以求得对象本身以及原型链上的属性?
// 这和上面的说法矛盾啊!!!
// 返回排序后的函数组成的数组
_.functions = _.methods = function(obj){
  var names = [];
  // 和上面比较
  // 放弃了对ie<9的支持
  for(var key in obj){
    if(_.isFunction(obj[key])){
      names.push(key);
    }
  }
  // 返回排序后的数组
  // 这个是按字母顺序排?
  // 默认排序顺序是根据字符串Unicode码点。

  return names.sort();
};

// 后面对象的所有键值对（本身以及原型链上的）添加到第一个对象上
// 出现相同key值，后面的可以覆盖前面的
_.extend = createAssigner(_.allKeys);

// 后面对象的本身的键值对添加到第一个对象上
// 出现相同key值，后面的可以覆盖前面的
_.extendOwn = _.assign = createAssigner(_.keys);

// 找到对象的键值对中第一个满足条件的键值对
// 对应数组方法_.findIndex
_.findKey = function(obj, predicate, context){
  predicate = cb(predicate, context);
  var keys = _.keys(obj), key;
  for(var i = 0, length = keys.length; i < length; i++){
    key = keys[i];
    if(predicate(obj[key], key, obj)){
      return key;
    }
  }
};

// 使用方法1:
// 需求可以是值,比如这里的'name', 'age'
// _.pick({name: 'moe', age: 50, userid: 'moe1'}, 'name', 'age');
// => {name: 'moe', age: 50}

// 使用方法2;
// 也可以是筛选函数,比如这里的
// function(value, key, object) {
//   return _.isNumber(value);
// }

// _.pick({name: 'moe', age: 50, userid: 'moe1'}, function(value, key, object) {
//   return _.isNumber(value);
// });
// => {age: 50}


_.pick = function(object, oiteratee, context){
  var result = {}, obj = object, iteratee, keys;
  // 此处用了可转换类型的比较形式
  // 对于undefined、null可以直接处理
  if(obj == null){
    return result;
  }
  // 下面这个if else 是对keys和iteratee的处理
  if(_.isFunction(oiteratee)){
    // _.allKeys()自带对象容错机制用于处理其他非标准对象的情况
    keys = _.allKeys(obj);
    iteratee = optimizeCb(oiteratee, context);
  }else{
    // 这样写不就把object也一起包含进来了么?
    // flatten是展开数组的函数，对象不会被展开
    keys = flatten(arguments, false, false, 1);
    iteratee = function(value, key, obj){ return key in obj;};
    // 手动处理非标准对象的情况
    obj = Object(obj);
  }

  for(var i = 0, length = keys.length; i < length; i++){
    var key = keys[i];
    var value = obj[key];
    if(iteratee(value, key, obj)){
      result[key] = value;
    }
  }
  return result;
};


// 返回不包含key值的对象的副本
//_.pick()的补集函数
_.omit = function(obj, iteratee, context){
  if(_.isFunction(iteratee)){
    iteratee = _.megate(iteratee);
  }else{
    // 此处传入了一个String构造函数？
    // 将数组的每个元素字符串化？
    // 使用String转换对象的结果是："[object Object]"！！！
    var keys = _.map(flatten(arguments, false, false, 1), String);
    iteratee = function(value, key){
      return !_.contains(keys, key);
    };
  }
  return _.pick(obj, iteratee, context);
};

// createAssigner的作用
// 返回一个函数
// 用来扩充对象的属性
// 如果某个属性已经存在，不会覆盖
// 属性包括对象本身的可枚举属性以及原型链上的可枚举属性
_.defaults = createAssigner(_.allKeys, true);

// 基于传入的原型，构造并返回一个新的对象
// 如果传入的参数中带有属性及属性值的话，扩充进来
_.create = function(prototype, props){
  var result = baseCreate(prototype);

  if(props){
    // 此处使用的是可以覆盖已有属性的扩充方法
    _.extendOwn(result, props);
  }
  return result;
};


//_.isObject = function(obj) {
//   var type = typeof obj;
//   return type === 'function' || type === 'object' && !!obj;
// };
// &&的优先级高于||
// 返回一个obj对象的复制对象，它们引用不同的地址，但是obj对象中的属性如果
// 是一个对象或数组之类的引用类型，它们引用的是相同的地址
_.clone = function(obj){
  if(!_.isObject(obj)){
    return obj;
  }
  return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
};

// 链式调用？
// _.chain([1,2,3,200])
//   .filter(function(num) { return num % 2 == 0; })
//   .tap(alert)
//   .map(function(num) { return num * num })
//   .value();
// => // [2, 200] (alerted)
// => [4, 40000]
// 写了这么多 怎么没有发现任何可以用来进行链式调用的蛛丝马迹？！
// 咋回事？!

// 立即返回结果
_.tab = function(obj, interceptor){
  interceptor(obj);
  return obj;
}

_.isMatch = function(object, attrs){
  var keys = _.keys(attrs), length = keys.length;

  // 如果object为空
  // 则根据attrs的键值对数量返回布尔值
  if(object == null){
    return !length;
  }
  // 为何要写这行代码？
  var obj = Object(object);

  // 如果obj对象没有attrs对象的某个key
  // 或者对于某个key，它们的value值不同
  // 则证明object不拥有attrs的所有键值对
  // 如此，返回false
  for(var i = 0; i < length; i++){
    var key = keys[i];
    if(attrs[key] !== obj[key] || !(key in obj)){
      return false;
    }
  }
  return false;
};

// 这个函数全部是显示进行类型转换
var eq = function(a, b, aStack, bStack){
  // 用来区分0和-0
  // 0 === -0 => true
  // 1/0 = Infinity
  // 1/-0 = -Infinity
  // 1/0 === 1/-0 => false
  if(a === b){
    return a !== 0 || 1 / a === 1 / b;
  }
  if(a == null || b == null){
    return a === b;
  }

  if(a instanceof _){
    a = a._wrapped;
  }
  if(b instanceof _){
    b = b._wrapped;
  }
  // 用Objec.prototype.toString.call方法获取a变量的类型
  // 先比较类型再比较值
  /*================这个判断很厉害么==================*/ 
  var className = toString.call(a);
  if(className !== toString.call(b)){
    return false;
  }
  /*==================================*/ 
  switch(className){
    case '[object RegExp]':
    case '[object String]':
      return '' + a === '' + b;
    case '[object Numer]':
      if(+a !== +a){
        return +b !== +b;
      }
      return +a === 0 ? 1 / +a === 1 /  b : +a === +b;
    case '[object Date]':
    case '[object Boolean]':
      return +a === +b;
  };

  // 判断a是否是数组
  var areArrays = className === '[object Array]';

  if(!areArrays){
    if(typeof a != 'object' || typeof b != 'object'){
      return false;
    }
    // 保证到此处，a和b都是对象
    var aCtor = a.constructor, bCtor = b.constructor;
    // 对下面这个if条件判断不理解啊
    // 首先，第一个aCtor !== bCtor
    // 构造函数不相等，不一定对应的对象就不等，比如在不同的框架中
    // 所以补充了后面的判断
    // 然而完全不明白这是在判断个啥
    if(aCtor !== bCtor && !(_.isFunction(aCtor) && 
    aCotr instanceof aCotr && _.isFunction(bCtor) 
    && bCtor instanceof bCtor) && ('constructor' 
    in a && 'constructor' in b)){
      return false;
    }
  }

  aStack = aStack || [];
  bStack = bStack || [];

  var length = aStack.length;

  while(length--){
    if(aStack[length] === a){
      return bStack[length] === b;
    }
  }

  aStack.push(a);
  bStack.push(b);

  if(areArrays){
    length = a.length;
    if(length !== b.length){
      return false;
    }
    while(length--){
      if(!eq(a[length], b[length], aStack, bStack)){
        return false;
      }
    }
  }else{
    var keys = _.keys(a), key;
    length = keys.length;
    if(_.keys(b).length !== length){
      return false;
    }
    while(length--){
      key = keys[length];
      if(!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))){
        return false;
      }
    }
  }
  aStack.pop();
  bStack.pop();

  return true;

};

_.isEqual = function(a, b){
  return eq(a, b);
};

// 判断传入的数组、字符串或是对象 是否是{}、[]、""、null、undefined
// 一个空对象没有可枚举的本地属性
_.isEmpty = function(obj){
  if(obj == null){
    return true;
  }

  // if条件的后半部分是为了排除{length: 10}这样的类数组的判断bug，它可以作为普通对象进行判断
  if(isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))){
    return obj.length === 0;
  }
  return _.keys(obj).length === 0;
};

// 判断是否是dom元素
_.isElement = function(obj){
  return !!(obj && obj.nodeType === 1);
};

// 判断是否是数组
_.isArray = function(obj){
  return toString.call(obj) === '[object Array]';
};

_.isObject = function(obj){
  var type = typeof obj;
  // 显示转换!!obj
  return type === 'function' || type === 'object' && !!obj;
};

// 注意！！！判断对象和判断其他类型使用的算法是不一样的！！！
_.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name){
  // 注意这里这个_[]的用法！！！
  _['is' + name] = function(obj){
    return toString.call(obj) === '[object ' + name + ']';
  };
});

// 针对ie<9, 使用callee属性作兼容
// ie<9 使用Object.prototype.toString.call返回[object Arguments]
if(!_.isArguments(arguments)){
  _.isArguments = function(obj){
    return _.has(obj, 'callee');
  };
}

// 不懂这个if条件啊
if(typeof /./ != 'function' && typeof Int8Array != 'object'){
  _.isFunction = function(obj){
    return typeof obj == 'function' || false;
  };
}

// isFinite和isNaN都是内置函数
// 这里为何要做这个判断 !isNaN(parseFloat(obj)
_.isFinite = function(obj){
  return isFinite(obj) && !isNaN(parseFloat(obj));
};

// _.isNaN(NaN);
// => true
// isNaN(undefined);
// => true
// _.isNaN(undefined);
// => false
// 感觉这个函数起不到上面的作用
_.isNaN = function(obj){
  return _.isNumber(obj) && obj !== +obj;
};

_.isBoolean = function(obj){
  return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
};

_.isNull = function(obj){
  return obj === null;
};

_.isUndefined = function(obj){
  return obj === void 0;
};

_.has = function(obj, key){
  return obj != null && hasOwnProperty.call(obj, key);
};

/*+++++++++++++++++++++++++++++++++++以下为工具++++++++++++++++++++++++++++++++++*/ 

// 天哪！！！不明白这个啊！！！
_.noConflict = function(){
  root._ = previousUnderscore;
  return this;
};

_.identity = function(value){
  return value;
};

// var stooge = {name: 'moe'};
// stooge === _.constant(stooge)();
// => true
// 握草！这个干嘛使？！
_.constant = function(value){
  return function(){
    return value;
  };
};

_.noop = function(){};

// var property = function(key){
//   return function(obj){
//     return obj == null ? void 0 : obj[key];
//   };
// };

_.property = property;

_.propertyOf = function(obj){
  return obj == null ? function(){} : function(key){
    return obj[key];
  };
};

// 判定一个给定的对象是否有某些键值对
_.matcher = _.matches = function(attrs){
  attrs = _.extendOwn({}, attrs);
  return function(obj){
    return _.isMatch(obj, attrs);
  };
};


_.times = function(n, iteratee, context){
  var accum = Array(Math.max(0, n));
  iteratee = optimizeCb(iteratee, context, 1);
  for(var i = 0; i < n; i++){
    accum[i] = iteratee(i);
  }
  return accum;
};

_.random = function(min, max){
  if(max == null){
    max = min;
    min = 0;
  }
  return min + Math.floor(Math.random() * (max - min + 1));
};

_.now = Date.now || function(){
  return new Date().getTime();
};

var escapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27',
  '`': '&#x60'
};

var unescapeMap = _.invert(escapeMap);








}.call(this));
