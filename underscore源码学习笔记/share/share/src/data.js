const Cases = [
  [{'title': '简介',
    'content': 'Underscore使用原生的javascript扩充了已有的方法或添加了原生javascript中不存在方法,\
是一个工具库，目的是提高写代码的效率。\n\n共有112个方法，分为集合类（25）、数组类（20）、函数类（14）、\
对象类（37）、实用功能（14）、链式语法（2）。\n\nunderscore很久没有更新了，现在最近的版本是1.8.3，很多人都在用lodash。'
  },
  {'title': '学到的',
  'content': '前后断断续续大概看了一个多月，关注的主要内容：\n\
  1.这个库如何引入到环境中以及整体架构\n\
  2.函数的创建，特别是闭包的使用\n\
  3.一些写代码的思路\n\
  4.更加熟悉了一些js的基础，比如原型链、this、原生函数等\n\
  5.学到一些小技术'
  
  },
  {'title': '参考资料',
  'content': '\n\
  1.underscore API\n\
  2.underscore 源码\n\
  3.underscore 源码分析\n\
  4.《javascript模式》'
  },

  ],
  [
    {'title': '_符号',
    'content': '_，这个符号相当于jQuery中的$。变成全局变量的方法：',
    'code': '1. (function() { ... }.call(this));//代码包在一个立即执行函数中，然后从全局作用域中给这个匿名函数传入一个指向this的参数\
    \n\n2.最开头 var root = this;//在客户端比如浏览器，root=window\
    \n\n3.  var _ = function(obj) \{\n      if (obj instanceof _\)\n\
          return obj\;\n      if (!(this instanceof _)\)\n\
          return new _(obj)\;\n\
        this._wrapped = obj\;\n\
      };\
    \n强制使用new的模式。使用new 调用构造函数时，函数体内发生的三件事：1.创建一个不包含自己属性的对象，将它的引用赋值给this，继承函数的原型；2.通过this将函数中的\n\
    属性和方法添加进这个对象3.最后返回this指向的新对象。注：参见《javascript模式》关于强制使用new模式的说明\
    \n\n4.if (typeof exports !== \'undefined\')\{\n\
      if (typeof module !== \'undefined\' && module.exports)\{\n\
        exports = module.exports = _\;\n\
      \}\n\
      exports._ = _\;\n\
    } else \{\n\
      root._ = _\;\n\
    }',
    'linkName': '注1：访问全局变量的最佳模式',
    'link': 'https://github.com/ginnko/javascript-patterns/blob/master/chapter2.markdown#%E8%AE%BF%E9%97%AE%E5%85%A8%E5%B1%80%E5%AF%B9%E8%B1%A1',
    },
    {
      'title': '调用方式',
      'content': '\
      1. 大多数时候使用这种形式: _.each([1, 2, 3], alert);\n\
      2. oop调用:_([1, 2, 3]).each(alert);\n\
      3. 链式调用:\n\
        _.chain([1, 2, 3]\)\n\
        .map(function(a) {return a * 2;}\)\n\
        .reverse(\)\n\
        .value();'

    },
    {
      'title': '实现上述三种调用的方法',
      'content': '四个重要函数：_(),result(),_.chain(),_.mixin()',
      'linkName': '注1:参见架构分析',
      'link': 'https://github.com/hanzichi/underscore-analysis/issues/27',
    }
  ],
  [
    {
      'title': '_.object()',
      'code': '_.isObject = function(obj) \{\n\
        var type = typeof obj\;\n\
        return type === \'function\' || type === \'object\' && !!obj\;\n\
      };',
    },
    {
      'title': 'isArrayLike()',
      'content': '满足三个条件：length属性是number类型，length值大于0，小于最大值。\
      能让这个函数返回true的类型有：数组、arguments、HTML Collection、NodeList、字符\
      串、函数、{length：10}这种对象。'
    },
    {
      'title': '_.isArray(obj)',
      'code': '_.isArray = nativeIsArray || function(obj) \{\n\
        return toString.call(obj) === \'[object Array]\'\;\n\
      };'
    },
    {
      'title': 'Arguments, Function, String, Number, Date, RegExp, Error类型判断',
      'code': '_.each([\'Arguments\', \'Function\', \'String\', \'Number\', \'Date\', \'RegExp\', \'Error\'], function(name)\{\n\
        \_[\'is\' + name] = function(obj)\{\n\
          return toString.call(obj) === \'[object \' + name + \']\'\;\n\
        }\;\n\
  })\;\n\n\
  //针对ie<9 的情况\n\n\
  if (!_.isArguments(arguments)) \{\n\
    _.isArguments = function(obj) \{\n\
      return _.has(obj, \'callee\')\;\n\
    }\;\n\
  }',
      'linkName': '注1：关于\_.each()',
      'link': 'http://underscorejs.org/#each'
    }
  ],
  [
    {
      'title': '分类',
      'content': '1.内部函数（路由函数）;2.创建其他函数的函数'
    },
    {
      'title': '函数柯里化公式',
      'content': 'underscore中绝大多数函数都是通过这种方式构建，下述代码是一个基本的公式，underscore中的构建方式都是在此基础上稍加变化而来。',
      'code': '\n\
      function schonfinkelize(fn) \{\n\
        var slice = Array.prototype.slice,\n\
        stored_args = slice.call(arguments, 1);\n\
        return function () {\n\
          var new_args = slice.call(arguments),\n\
          args = stored_args.concat(new_args);\n\
          return fn.apply(null, args);\n\
        };\n\
      }'
    },
    {
      'title': '内部函数1：optimizeCb()',
      'content': '处理函数的函数, 针对函数是否指定上下文以及传入参数的数量来指定对应的返回函数（函数定义中，其中一个参数是context，\n\
用于绑定this指向，这是由于函数的this值是在进入执行上文才确定的原因,在《javascript模式》中有详细说明，所以underscore库中涉及\n\
回调函数的地方都有传入context进行绑定）',
      'linkName':'注1:参见optimizeCb()的定义',
      'link':'https://github.com/hanzichi/underscore-analysis/blob/master/underscore-1.8.3.js/underscore-1.8.3-analysis.js#L107',
    },
    {
      'title': '内部函数2：cb()',
      'content': '针对null,对象,函数,其他类型返回相应值的路由函数',
      'linkName': '注2:参加cb()的定义',
      'link': 'https://github.com/hanzichi/underscore-analysis/blob/master/underscore-1.8.3.js/underscore-1.8.3-analysis.js#L149',
    },
    {
      'title': '利用闭包创建函数1：createReduce()',
      'content': '用来创建reduce和reduceRight两个函数',
      'linkName': '注3:参见createReduce()的定义',
      'link': 'https://github.com/hanzichi/underscore-analysis/blob/master/underscore-1.8.3.js/underscore-1.8.3-analysis.js#L337',
    },
    {
      'title': '利用闭包创建函数2：group()',
      'linkName': '注4:参见group()的定义',
      'link': 'https://github.com/hanzichi/underscore-analysis/blob/master/underscore-1.8.3.js/underscore-1.8.3-analysis.js#L704',
    },
    {
      'title': '已有函数拼凑的函数：_.pluck()',
      'code': '  _.pluck = function(obj, key)\{\n\
        return _.map(obj, _.property(key))\;\n\
    };',
      'linkName': '注5:pluck函数的使用',
      'link': 'http://underscorejs.org/#pluck',
    },
  ],
  [
    {
      'title': '使用void 0 替代 undefined',
      'content': 'undefined在低版本以及es5的函数作用域中能被重写。\n\n\
void不能被重写，void * 会返回undefined。\n\n\
减少字节数。',
    },
    {
      'title': '把不同情况归一处理',
      'content': '感觉underscore内部的一个设计原则就是不同情况归一处理来简化代码。',
      'linkName': '注1：参见_.map()的实现代码',
      'link': 'https://github.com/hanzichi/underscore-analysis/blob/master/underscore-1.8.3.js/underscore-1.8.3-analysis.js#L311',
    },
    {
      'title': '原型链上的属性简写',
      'content': 'hasOwnProperty有两种调用方式，一种是面向对象的模式，一种是函数应用模式。使用后一种可以避免调用时的命名冲突，也可以避免冗长的\n属性查找。结合对hasOwnProperty()的缓存。',
      'code': 'var ObjProto = Object.prototype;\n\
hasOwnProperty = ObjProto.hasOwnProperty;\n\
return obj != null && hasOwnProperty.call(obj, key);'
    },
    {
      'title': '值的相等判断',
      'content': 'underscore中使用\'==\'数量多于\'===\'。'
    }
  ],
  [
    {
      'title': '函数节流和去抖',
      'content': '解决请求速度和响应速度不匹配的方法',
    },
    {
      'title': '函数节流',
      'content': '某个时段内，频发事件只触发一次。\n\n\
      使用场景：\n\n\
      1.文本输入的验证（连续输入文字后发送 AJAX 请求进行验证，验证一次就好）；\n\n\
      2.DOM 元素动态定位，window 对象的 resize 和 scroll 事件。',
      'linkName': '注1：函数节流分析',
      'link': 'https://github.com/hanzichi/underscore-analysis/issues/22',
    },
    {
      'title': '函数去抖',
      'content': '只要有事件发生就重新计时，直到满足停顿的时间再触发一次。\n\n\
      使用场景：\n\n\
      1.DOM 元素的拖拽功能实现;\n\n\
      2.计算鼠标移动的距离。',
      'linkName': '注2：函数去抖分析',
      'link': 'https://github.com/hanzichi/underscore-analysis/issues/21',
    },
  ],
];

export {Cases};

/*
1.有用的技术：增加节流和去抖（2）
2.函数思路：增加void 0，对数组和对象key的使用，对不同对象的归一化的使用（3）
*/ 